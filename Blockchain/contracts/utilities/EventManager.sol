pragma solidity ^0.5.2;

import "../_resources/openzeppelin-solidity/math/SafeMath.sol";
import "../membershipManager/IRewardIssuer.sol";
import "../_resources/ERC223/ERC223Receiver.sol";
import "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";

contract EventManager is IRewardIssuer, ERC223Receiver {
    using SafeMath for uint256;

    address public tokenManager;
    address public rewardManager;
    address public admin; // Debug admin

    uint256 public creationCost = 5; // Defaulting for demo
    uint256 public numberOfEvents = 0;

   
    mapping(uint256 => EventData) public events;
    /// For a reward to be issued, user state must be set to 99, meaning "Rewardable" this is to be considered the final state of users in issuer contracts
    mapping(uint256 => mapping(address => uint8)) public memberState;
    // States:
    // 0: Not registered
    // 1: RSVP'd
    // 98: Paid
    // 99: Attended (Rewardable)

    // Encoded function sigs 
    bytes4 CREATE_EVENT_SIG = bytes4(keccak256("_createEvent(string,uint24,address,uint256,uint256)"));
    bytes4 RSVP_SIG = bytes4(keccak256("_rsvp(uint256,address)"));

    // Ordered for struct packing
    struct EventData{
        address organiser;
        uint256 requiredStake;
        uint256 totalStaked;
        uint256 payout;
        uint256 creationDeposit;
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
        require(msg.sender == address(tokenManager), "Not registered token address");
        _;
    }

    modifier onlyRewardManager() {
        require(msg.sender == rewardManager, "Only reward manager authorised");
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

    modifier onlyAcceptedFunction(bytes memory _data, uint256 _value) {
        bytes4 functionSignature = extractSignature(_data);
        require(functionSignature == CREATE_EVENT_SIG || functionSignature == RSVP_SIG, "Function Signature not recognised");
        if(functionSignature == RSVP_SIG){
            uint256 index = extractIndex(_data);
            require(events[index].requiredStake == _value, "Incorrect staking amount");
        } else {
            require(_value == creationCost, "Incorrect staking amount");
        }
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
        address _rewardManager, 
        uint256 _creationCost
    ) 
        public 
    {
        admin = msg.sender;
        tokenManager = _tokenManager;
        rewardManager = _rewardManager;
        creationCost = _creationCost;
    }

    /**
      * @dev Updates the creation cost and bonus for events 
      *     that max out attendance. This function is only callable by the 
      *     admin/creator of this contract.
      * @param _creationCost : The price of creating an event
      */
    function updateStakes(
        uint256 _creationCost
    ) 
        public 
        onlyAdmin()
    {
        creationCost = _creationCost;
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
        require(_forwardStake(creationCost), "Must forward funds to the reward manager");
        uint256 index = numberOfEvents;
        
        events[index].name = _name;
        events[index].maxAttendees = _maxAttendees;
        events[index].organiser = _organiser;
        events[index].requiredStake = _requiredStake;
        events[index].state = 1;
        events[index].creationDeposit = creationCost;

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
      * @dev Forwards an amount of a members stake. 
      * @param _amount : The amount of stake to forward.
      */
    function _forwardStake(uint256 _amount) 
        internal 
        returns(bool) 
    {
        IERC20 token = IERC20(tokenManager);
        token.transfer(rewardManager, _amount);    
        return true;
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
        require(_forwardStake(events[_index].requiredStake), "Must forward funds to the reward manager");
        /// Send stake to reward manager
        /// Updated state
        memberState[_index][_member] = 1;
        events[_index].totalStaked.add(events[_index].requiredStake);
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
      * @dev Allows the token manager to execute functions having been sent stake 
      *      in one call/
      * @param _from : The original account executing the function call.
      * @param _value : The amount of tokens sent with the call.
      * @param _data : The encoded function call. 
      */
    function tokenFallback(address _from, uint _value, bytes calldata _data) 
        external 
        onlyToken() 
        onlyAcceptedFunction(_data, _value)
    {
        (bool success, bytes memory data) = address(this).call(_data);
        require(success, "Call on encoded function failed.");
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
        onlyRewardManager() 
        onlyMember(_member, _index) 
        returns(uint256)
    {
        require(memberState[_index][_member] == 99, "No stake available to be returned");
        require(events[_index].state == 3 || events[_index].state == 4, "Event not ended");
        if(events[_index].organiser == _member){
            memberState[_index][_member] = 98;
            return events[_index].creationDeposit;
        }

        if(events[_index].state == 3){
            memberState[_index][_member] = 98;
            return events[_index].payout;
        } else if(events[_index].state == 4) {
            memberState[_index][_member] = 98;
            return events[_index].requiredStake;
        }
    }

    /**
      * @dev Extract the signature from calldata bytes
      * @param _data : Calldata to be parse to extract signature 
      */
    function extractSignature(bytes memory _data) private pure returns (bytes4) {
        return (bytes4(_data[0]) | bytes4(_data[1]) >> 8 |
            bytes4(_data[2]) >> 16 | bytes4(_data[3]) >> 24);
    }

    /**
      * @dev Extract the signature from calldata bytes
      * @param _data : Calldata to be parse to extract signature 
      */
    function extractIndex(bytes memory _data) private pure returns (uint256) {
        uint256 outInt;
        
        // We here skip the function signature (4 bytes so skipping 0x20 + 4)
        assembly {
            outInt := mload(add(_data, 0x24))
        }

        return outInt;
    }
}