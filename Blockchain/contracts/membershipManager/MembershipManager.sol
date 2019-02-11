pragma solidity >=0.5.2 < 0.6.0;

import "../openzeppelin-solidity/token/ERC20/IERC20.sol";
import "../_resources/ERC223/ERC223Receiver.sol";
import "../tokenManager/ITokenManager.sol";

// TODO: add owned interface

// Roles are set to be dynamic but the syntax is that priviledged access roles are 
// indexed 1000 or greater

contract MembershipManager is ERC223Receiver{
    address internal tokenManager_;
    uint8 internal membershipTypeTotal_;

    mapping(address => uint8) internal roles_;

    mapping(address => RegisteredUtility) internal registeredUtility_;
    mapping(address => mapping (uint8 => uint256)) internal reputationRewards_;

    mapping(address => Membership) internal membershipState_;
    mapping(uint8 => MembershipType) internal membershipType_;
   
    struct RegisteredUtility{
        uint8 usageCost;
        bool active;
        mapping(uint256 => uint256) stakedPool; // When contribution points are staked, each utility gets a pool of skin in the game colateral
        mapping(uint256 => mapping(address => uint256)) contributions; // Traking individual token values sent in
    }

    struct MembershipType{
        uint256 membershipLength;
        uint8 maxCommitment;
        uint256 daiValue;
    }

    struct Membership{
        uint256 expires;
        uint256 tokensStaked;
        uint256 reputation;
        uint8 membershipType;
        uint8 activeCommitment;
    }

    event UtilityAdded(address issuer);
    event UtilityRemoved(address issuer);
    event ReputationRewardSet(address indexed issuer, uint8 id, uint256 amount);

    event CommitmentLocked(address indexed member, address indexed utility, uint8 amount);
    event CommitmentUnlocked(address indexed member, address indexed utility, uint8 amount);

    event MembershipStaked(address member, uint8 indexed id);
   
    modifier onlyAdmin() {
        require(roles_[msg.sender] >= 1000, "User not authorised");
        _;
    }

    modifier onlyUtility(address _utilityAddress){
        require(registeredUtility_[_utilityAddress].active, "Address is not a registered utility");
        _;
    }

    modifier membershipActive(address _member){
        require(membershipState_[_member].membershipExpiring < now, "Membership expired, please renew");
        _; 
    }

    modifier onlyAcceptedFunction(bytes memory _data, uint256 _value) {
        bytes4 functionSignature = extractSignature(_data);
        require(functionSignature == MembershipManager(0).registerMembership.selector, 
        "Function Signature not recognised");

        uint8 index = extractIndex(_data);
        require(membershipType_[index].daiValue == ITokenManager(tokenManager_).rewardForBurn(_value), 
        "Insufficent tokens");
        _;
    }

    constructor(address _tokenManager, address _communityManager) public {
        roles_[_communityManager] = 1000;
        tokenManager_ = _tokenManager;
    }

    function addMembershipType() public onlyAdmin returns(uint256) {

    }

    function deactivateMembershipType() public onlyAdmin{

    }

    function addUtility(address _utility, uint8 _usageCost) public onlyAdmin{
        registeredUtility_[_utility].active = true;
        registeredUtility_[_utility].usageCost = _usageCost;
    }

    function removeUtility(address _utility) public onlyAdmin{
        registeredUtility_[_utility].active = false;
        registeredUtility_[_utility].usageCost = 0;
    }

    function setRewardEvent(address _utility, uint8 _id, uint256 _rewardAmount) public onlyAdmin onlyUtility(_utility){
        reputationRewards[_utility][_id] = _rewardAmount;
    }

  
    function registerMembership(uint8 _membershipType, uint256 _colateral, address _member) external /** onlySelf() */ {
        // Encoded function call
        membershipState_[_member].expires = now + membershipType_[_membershipType].membershipLength;
        membershipState_[_member].tokensStaked = _colateral;
        membershipState_[_member].membershipType = _membershipType;
    }

    function renewMembership() {

    }


    function lockCommitment(address _member, uint256 _index) external returns (bool) /* onlyUtility(msg.sender)*/  {
        require(membershipState_[_member].expires < now, "Membership expired");
        require(
            (membershipState_[_member].activeCommitment + registeredUtility_[msg.sender].usageCost) <= membershipType_[membershipState_[_member].membershipType].maxCommitment, 
            "Commitment level exceeded"
        );

        // Calculates the amount of the membership tokens are being staked with the contribution
        // TODO: calculate contribution value 
        
        uint256 contribution =  membershipState_[_member].tokensStaked.div(
            membershipType_[membershipState_[_member].membershipType].maxCommitment
        ).mul(
            registeredUtility_[msg.sender].usageCost
        );

        membershipState_[_member].activeCommitment = membershipState_[_member].activeCommitment + registeredUtility_[msg.sender].usageCost;
        registeredUtility_[msg.sender].contributions[_index][_member] = contribution;
        registeredUtility_[msg.sender].stakedPool[_index] = registeredUtility_[msg.sender].stakedPool[_index].add(contribution);

        return true;
    }

    function unlockCommitment(address _member, uint256 _index) external returns (bool) /* onlyUtility(msg.sender)*/  {
        // TODO: check the commitment locked by the utility

        membershipState_[_member].activeCommitment = membershipState_[_member].activeCommitment - registeredUtility_[msg.sender].usageCost;
        return true;
    }

    function tokenFallback(address _from, uint _value, bytes calldata _data) 
        external 
        /** onlyTokenManager 
        onlyAcceptedFunction(_data, _value)*/
    {
        (bool success, bytes memory data) = address(this).call(_data);
        require(success, "Call on encoded function failed.");
    }

    function reputationOf(address _account) public view returns(uint256) {
        return (reputation[_account]);
    }

    function getMembershipType(uint8 _index) public view returns(MembershipType){
        return membershipType_[_index];
    }

    function getMembershipStatus(address _member) 
        public 
        view 
        returns(uint256, uint256, uint8, uint8)
    {
        return (
            membershipState_.expires,
            membershipState_.reputation,
            membershipState_.membershipType,
            membershipState_.activeCommitment
        );
    }

    function tokenManager() public view returns(address) {
        return tokenManager_;
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
    function extractIndex(bytes memory _data) private pure returns (uint8) {
        uint8 outInt;
        
        // We here skip the function signature (4 bytes so skipping 0x20 + 0x04)
        assembly {
            outInt := mload(add(_data, 0x24))
        }

        return outInt;
    }
}