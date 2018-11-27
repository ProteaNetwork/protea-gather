pragma solidity ^0.4.24;

import "./openzeppelin-solidity/math/SafeMath.sol";
import "./RewardIssuerInterface.sol";
import "./ERC223/ERC223Receiver.sol";
import "./openzeppelin-solidity/token/ERC20/IERC20.sol";

contract EventManager is RewardIssuerInterface, ERC223Receiver {
    using SafeMath for uint256;

    address public tokenManager;
    address public rewardManager;
    address public admin; // Debug admin

    uint256 public creationCost = 20; // Defaulting for demo
    uint256 public maxAttendanceBonus = 5;
    uint256 public numberOfEvents = 0;

    mapping(uint256 => EventData) public events;
    /// For a reward to be issued, user state must be set to 99, meaning "Rewardable" this is to be considered the final state of users in issuer contracts
    mapping(uint256 => mapping(address => uint8)) public memberState;
    // States:
    // 0: Not registered
    // 1: RSVP'd
    // 99: Attended (Rewardable)
  
    struct EventData{
        string name;
        uint256 requiredStake;
        uint24 maxAttendees;
        uint24 currentAttendees;
        uint24 attended;
        address organiser;
        uint256 totalStaked;
        uint24 state;
        uint256 payout;
        uint256 participantLimit;
    }

    event EventCreated(uint256 indexed index, address publisher);
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

    modifier onlyManager(uint256 _index){
        require(events[_index].organiser == msg.sender, "Account not organiser");
        _;
    }

    /**
      * @dev Sets the address of the admin to the 
      *     msg.sender.
      */
    constructor () public {
        admin = msg.sender;
    }

    /**
      * @dev Gives the EventManager the addresses of 
      *     the functions it may need to talk to or be called 
      *     by (for modifiers). This function is only callable by the 
      *     admin/creator of this contract.
      * @param _tokenManager : The address of the token manager contract
      * @param _rewardManager : The address of the reward manager contract
      * @param _creationCost : The price of creating an event
      * @param _maxAttendanceBonus : The bonus the event will recive for 
      *     running an event that maxed out on atendance. 
      */
    function initContract(
        address _tokenManager, 
        address _rewardManager, 
        uint256 _creationCost, 
        uint256 _maxAttendanceBonus
    ) 
        public 
        onlyAdmin() 
    {
        tokenManager = _tokenManager;
        rewardManager = _rewardManager;
        creationCost = _creationCost;
        maxAttendanceBonus = _maxAttendanceBonus;
    }

    /**
      * @dev Updates the creation cost and bonus for events 
      *     that max out attendance. This function is only callable by the 
      *     admin/creator of this contract.
      * @param _creationCost : The price of creating an event
      * @param _maxAttendanceBonus : The bonus the event will recive for 
      *     running an event that maxed out on atendance. 
      */
    function updateStakes(
        uint256 _creationCost, 
        uint256 _maxAttendanceBonus
    ) 
        public 
        onlyAdmin()
    {
        creationCost = _creationCost;
        maxAttendanceBonus = _maxAttendanceBonus;
    }

    /**
      * @dev Creates an event. 
      * @param _name : The name of the event. 
      * @param _maxAttendees : The max number of attendees 
      *     for this event. 
      * @param _organiser : The orgoniser of the event
      * @param _requiredStake : The price of a 'ticket' for the 
      *     event. 
      */
    function _createEvent(
        string _name, 
        uint24 _maxAttendees, 
        address _organiser, 
        uint256 _requiredStake,
        uint256 _participantLimit
    ) 
        private 
    {
        require(_forwardStake(creationCost, _organiser), "Must forward funds to the reward manager");
        numberOfEvents += 1;
        events[numberOfEvents].name = _name;
        events[numberOfEvents].maxAttendees = _maxAttendees;
        events[numberOfEvents].organiser = _organiser;
        events[numberOfEvents].requiredStake = _requiredStake;
        events[numberOfEvents].participantLimit = _participantLimit;
        events[numberOfEvents].currentAttendees = 0;
        events[numberOfEvents].totalStaked = 0;
        events[numberOfEvents].state = 0;
        emit EventCreated(numberOfEvents, _organiser);
        // bytes4 CREATE_SIG = bytes4(keccak256("_createEvent(string,string,string,uint24,address,uint256)"));
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
            string _name, 
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
    function endEvent(uint256 _index) 
        public 
        onlyManager(_index)
    {
        require(events[_index].state == 1, "Event not active");
        events[_index].state = 2;
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
    {
        require(events[_index].state == 1, "Event not active");
        events[_index].state = 3;
        emit EventConcluded(_index, msg.sender, events[_index].state);
    }

    /**
      * @dev Forwards an amount of a members stake. 
      * @param _amount : The amount of steak to forward.
      * @param _member : The members address. 
      */
    function _forwardStake(uint256 _amount, address _member) 
        internal 
        returns(bool) 
    {
        IERC20 token = IERC20(tokenManager);
        token.transfer(_member, _amount);    
        return true;
    }

    /**
      * @dev Allows a member to RSVP for an event.
      * @param _index : The index of the event.
      * @param _member : Address of the member RSVPing. 
      */
    function _rsvp(uint256 _index, address _member) 
        private 
    {
        require(_forwardStake(events[_index].requiredStake, _member), "Must forward funds to the reward manager");
        /// Send stake to reward manager
        /// Updated state
        memberState[_index][_member] = 1;
        events[_index].totalStaked.add(events[_index].requiredStake);
        events[_index].currentAttendees += 1;
        emit MemberRegistered(_index, _member);
        /** bytes4 RSVP_SIG = bytes4(keccak256("rsvp(uint256,address)"));
          * To encode it with paramiters (ie not just the function signature)
          * add the paramiters after the :
          * (numbering (1 2 3) for ease of reading)
          * this.call(1 bytes32(2 keccak256(3 "toEncode(uint8)")3 )2, 87 )1;
          * this.call(  bytes32(  keccak256(  "toEncode(uint8)")  ),  87 );
          * bytes4(keccak256("rsvp(uint256,address)"), 123, "0x0");
          */
    }

    /**
      * @dev Allows a member to confirm attendance. Uses the 
      *     msg.sender as the address of the member. 
      * @param _index : The index of the event in the array.
      */
    function confirmAttendance(uint256 _index) 
        public 
    {
        require(memberState[_index][msg.sender] == 1, "User not registered");
        memberState[_index][msg.sender] = 99;
        // Manual exposed attend until Proof of Attendance 
        //partial release mechanisim is finished
    }
    
    /**
      * @dev Allows the token manager to send encoded function calls 
      *     to the event manager (this contract). This means any function
      *     that is not external [needs citation] to be called. 
      * @param _from : The origional sendre of the function call.
      * @param _value : The amount of tokens sent with the call.
      * @param _data : The encoded function call. 
      */
    function tokenFallback(address _from, uint _value, bytes _data) 
        external 
        onlyToken() 
    {
        require(this.call(_data), "Call on encoded function failed.");
        // 2 kinds of request with stake 
        // 1. Create, which has all the event info and the creation stake
        // 2. an event index and the required stake
        // event Testing(bytes4 signure, bytes4 signure2, bytes4 signure4, bytes data);
    }

    /**
      * @dev Calculates the payout for atendees.
      * @param _index : The index of the event in the event manager.
      */
    function _calcPayout(uint256 _index) 
        internal 
    {
        uint256 reward = events[_index].totalStaked / events[_index].currentAttendees; 
        events[_index].payout = reward.add(maxAttendanceBonus.mul(events[_index].attended).div(events[_index].participantLimit));
    }

    /**
      * @dev Pays out an atendee of an event. This function is 
      *     only callable by the atendee. 
      * @param _member : The member to be paid out 
      * @param _index : The index of the event of the array. 
      */
    function payout(address _member, uint256 _index) 
        external 
        view 
        // onlyRewardManager() 
        onlyMember(_member, _index) 
        returns(uint256)
    {
        require(memberState[_index][_member] == 99, "User not attended");
        require(events[_index].state > 1, "Event not ended");
        if(events[_index].state == 3){
            return events[_index].requiredStake;
        } else if(events[_index].state == 3) {
            return events[_index].payout;
        }
    }
}

/*
    This contract diverts stake to the reward manager, sets up a user in a standardised struct

    rewardable = 99

    The reward manager if it finds in the user mapping state = 99 it allows payment, the amount being a standardised function that returns a uint

    Calculating the reward in relation to attendance rate is done in that function
*/