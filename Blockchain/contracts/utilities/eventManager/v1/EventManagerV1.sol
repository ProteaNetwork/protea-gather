pragma solidity >=0.5.3 < 0.6.0;

import { SafeMath } from "../../../_resources/openzeppelin-solidity/math/SafeMath.sol";
import { IERC20 } from "../../../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";

/// @author Ryan @ Protea
/// @title Basic staked event manager
contract EventManagerV1 {
    using SafeMath for uint256;

    address internal tokenManager_;
    address internal membershipManager_;
    address internal admin; // Debug admin // 

    uint256 internal numberOfEvents = 0;

   
    mapping(uint256 => EventData) internal events;
    /// For a reward to be issued, user state must be set to 99, meaning "Rewardable" this is to be considered the final state of users in issuer contracts
    mapping(uint256 => mapping(address => uint8)) internal memberState;
    // States:
    // 0: Not registered
    // 1: RSVP'd
    // 98: Paid
    // 99: Attended (Rewardable)

    // Ordered for struct packing
    struct EventData{
        address organiser;
        uint256 requiredStake;
        uint256 totalStaked;
        uint256 payout;
        uint24 state;
        uint24 maxAttendees;
        uint24 currentAttendees;
        string name;
    }

    event EventCreated(uint256 indexed index, address publisher);
    event EventStarted(uint256 indexed index, address publisher);
    event EventConcluded(uint256 indexed index, address publisher, uint256 state);
    event MemberRegistered(uint256 indexed index, address member);
    event MemberAttended(uint256 indexed index, address member);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authoriesd");
        _;
    }

    modifier onlyMember(address _member, uint256 _index){
        require(memberState[_index][_member] >= 1, "User not registered");
        _;
    }

    modifier onlyToken(){
        require(msg.sender == address(tokenManager_), "Not registered token address");
        _;
    }

    modifier onlyMembershipManager() {
        require(msg.sender == membershipManager_, "Only membership manager authorised");
        _;
    }

    modifier onlyManager(uint256 _index) {
        require(events[_index].organiser == msg.sender, "Account not organiser");
        _;
    }

    // Pseudo private modifier for function through staking execution 
    modifier onlySelf(){
        require(msg.sender == address(this), "Callable through staking only");
        _;
    }

    modifier onlyPending(uint256 _index) {
        require(events[_index].state == 1, "Event not pending");
        _;
    }

    modifier onlyStarted(uint256 _index) {
        require(events[_index].state == 2, "Event not started");
        _;
    }

    modifier onlyRegistered(uint256 _index) {
        require(memberState[_index][msg.sender] == 1, "User not registered");
        _;
    }

    /**
      * @dev Sets the address of the admin to the 
      *     msg.sender.
      */
    constructor (
        address _tokenManager, 
        address _membershipManager
    ) 
        public 
    {
        admin = msg.sender;
        tokenManager_ = _tokenManager;
        membershipManager_ = _membershipManager;
    }

    /**
      * @dev Creates an event. 
      * @param _name : The name of the event. 
      * @param _maxAttendees : The max number of attendees 
      *     for this event. 
      * @param _organiser : The orgoniser of the event
      * @param _requiredStake : The price of a 'deposit' for the 
      *     event. 
      */
    function _createEvent(
        string calldata _name, 
        uint24 _maxAttendees, 
        address _organiser, 
        uint256 _requiredStake
    ) 
        external
        onlySelf() 
        returns(bool) 
    {
        uint256 index = numberOfEvents;
        
        events[index].name = _name;
        events[index].maxAttendees = _maxAttendees;
        events[index].organiser = _organiser;
        events[index].requiredStake = _requiredStake;
        events[index].state = 1;

        memberState[index][_organiser] = 99;

        numberOfEvents++;
        emit EventCreated(index, _organiser);
        return true;
    }

    /**
      * @dev Gets the details of an event.
      * @param _index : The index of the event in the array of events. 
      * @return Event details. 
      */
    function getEvent(uint256 _index) 
        public 
        view 
        returns(
            string memory _name, 
            uint24 _maxAttendees, 
            address _organiser,
            uint256 _requiredStake, 
            uint24 _currentAttendees,
            uint256 _totalStaked,
            uint24 _state,
            uint256 _payout
        )
    {
        _name = events[_index].name;
        _maxAttendees = events[_index].maxAttendees;
        _organiser = events[_index].organiser;
        _requiredStake = events[_index].requiredStake;
        _currentAttendees = events[_index].currentAttendees;
        _totalStaked = events[_index].totalStaked;
        _state = events[_index].state;
        _payout = events[_index].payout;
        
    }

    /**
      * @dev Increases the limit on the number of participants. 
      *     Only the event manager can call this function.
      * @param _index : The index of the event.
      * @param _limit : The new participation limit for the event. 
      */
    function increaseParticipantLimit(uint256 _index, uint24 _limit) 
        public 
        onlyManager(_index)
    {
        require(events[_index].maxAttendees < _limit, "Limit can only be increased");
        events[_index].maxAttendees = _limit;
    }

    /**
      * @dev Allows an event manager to end an event. This function is 
      *     only callable by the manager of the event. 
      * @param _index : The index of the event in the array of 
      *     events. 
      */
    function startEvent(uint256 _index) 
        public 
        onlyManager(_index)
        onlyPending(_index)
    {
        require(events[_index].state == 1, "Unable to start event, either already started or ended");
        events[_index].state = 2;
        emit EventStarted(_index, msg.sender);
    }

    /**
      * @dev Allows an event manager to end an event. This function is 
      *     only callable by the manager of the event. 
      * @param _index : The index of the event in the array of 
      *     events. 
      */
    function endEvent(uint256 _index) 
        public 
        onlyManager(_index)
        onlyStarted(_index)
    {
        events[_index].state = 3;
        _calcPayout(_index);
        emit EventConcluded(_index, msg.sender, events[_index].state);
    }

    /**
      * @dev Allows an event manager to cancel an event. 
      *     This function is only callable by the event manager.
      * @param _index : The index of the event in the array of events. 
      */
    function cancelEvent(uint256 _index) 
        public 
        onlyManager(_index)
        onlyPending(_index)
    {
        events[_index].state = 4;
        emit EventConcluded(_index, msg.sender, events[_index].state);
    }


    /**
      * @dev Allows a member to RSVP for an event.
      * @param _index : The index of the event.
      * @param _member : Address of the member RSVPing. 
      */
    function _rsvp(uint256 _index, address _member) 
        external  
        onlySelf() 
        onlyPending(_index)
        returns (bool)
    {
        require(memberState[_index][_member] == 0, "RSVP not available");
        // require(_forwardStake(events[_index].requiredStake), "Must forward funds to the reward manager");
        // TODO: lock up collateral in MM
        /// Send stake to reward manager
        /// Updated state
        memberState[_index][_member] = 1;
        events[_index].totalStaked.add(events[_index].requiredStake); // TODO: Get this from MM 
        events[_index].currentAttendees++;
        emit MemberRegistered(_index, _member);
        return true;
    }

    /**
      * @dev Allows a member to confirm attendance. Uses the 
      *     msg.sender as the address of the member. 
      * @param _index : The index of the event in the array.
      */
    function confirmAttendance(uint256 _index) 
        public 
        onlyStarted(_index)
        onlyRegistered(_index)
    {
        memberState[_index][msg.sender] = 99;
        // Manual exposed attend until Proof of Attendance 
        //partial release mechanisim is finished
    }

  
    /**
      * @dev Calculates the payout for atendees.
      * @param _index : The index of the event in the event manager.
      */
    function _calcPayout(uint256 _index) 
        internal 
    {
        events[_index].payout = events[_index].totalStaked.div(events[_index].currentAttendees); 
    }

    /**
      * @dev Pays out an atendee of an event. This function is 
      *     only callable by the atendee. 
      * @param _member : The member to be paid out 
      * @param _index : The index of the event of the array. 
      */
    function payout(address _member, uint256 _index) 
        external 
        onlyMember(_member, _index) 
        returns(uint256)
    {
        require(memberState[_index][_member] == 99, "No stake available to be returned");
        require(events[_index].state == 3 || events[_index].state == 4, "Event not ended");

        if(events[_index].state == 3){
            memberState[_index][_member] = 98;
            return events[_index].payout;
        } else if(events[_index].state == 4) {
            memberState[_index][_member] = 98;
            return events[_index].requiredStake;
        }
    }
}