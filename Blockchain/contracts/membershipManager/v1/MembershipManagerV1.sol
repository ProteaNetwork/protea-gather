pragma solidity >=0.5.3 < 0.6.0;

import { IERC20 } from "../../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";
import { SafeMath } from "../../_resources/openzeppelin-solidity/math/SafeMath.sol";
import { Roles } from "../../_resources/openzeppelin-solidity/access/Roles.sol";
import { ITokenManager } from "../../tokenManager/ITokenManager.sol";

// Use Library for Roles: https://openzeppelin.org/api/docs/learn-about-access-control.html

/// @author Ryan @ Protea 
/// @title V1 Membership Manager
contract MembershipManagerV1 {
    using SafeMath for uint256;
    using Roles for Roles.Role;

    address internal tokenManager_;
    uint8 internal membershipTypeTotal_;

    bool internal disabled = false;

    Roles.Role internal admins_;
    Roles.Role internal systemAdmins_;

    mapping(address => RegisteredUtility) internal registeredUtility_;
    mapping(address => mapping (uint8 => uint256)) internal reputationRewards_;

    mapping(address => Membership) internal membershipState_;
   
    struct RegisteredUtility{
        bool active;
        mapping(uint256 => uint256) lockedStakePool; // Total Stake withheld by the utility
        mapping(uint256 => mapping(address => uint256)) contributions; // Traking individual token values sent in
    }

    struct Membership{
        uint256 currentDate;
        uint256 availableStake;
        uint256 reputation;
    }

    event UtilityAdded(address issuer);
    event UtilityRemoved(address issuer);
    event ReputationRewardSet(address indexed issuer, uint8 id, uint256 amount);

    event StakeLocked(address indexed member, address indexed utility, uint256 tokenAmount);
    event StakeUnlocked(address indexed member, address indexed utility, uint256 tokenAmount);

    event MembershipStaked(address indexed member, uint256 tokensStaked);
   
    constructor(address _communityManager) public {
        admins_.add(_communityManager);
        systemAdmins_.add(_communityManager);
        systemAdmins_.add(msg.sender); // This allows the deployer to set the membership manager
    }

    modifier onlyAdmin() {
        require(admins_.has(msg.sender), "User not authorised");
        _;
    }

    modifier onlySystemAdmin() {
        require(systemAdmins_.has(msg.sender), "User not authorised");
        _;
    }

    modifier onlyUtility(address _utilityAddress){
        require(registeredUtility_[_utilityAddress].active, "Address is not a registered utility");
        _;
    }

    function initialize(address _tokenManager) external onlySystemAdmin returns(bool) {
        require(tokenManager_ == address(0), "Contracts initalised");
        tokenManager_ = _tokenManager;
        systemAdmins_.remove(msg.sender);
        return true;
    }

    function addUtility(address _utility) external onlyAdmin{
        registeredUtility_[_utility].active = true;
    }

    function removeUtility(address _utility) external onlyAdmin {
        registeredUtility_[_utility].active = false;
    }

    function addAdmin(address _newAdmin) external onlyAdmin {
        admins_.add(_newAdmin);
        // Emit
    }

    function addSystemAdmin(address _newAdmin) external onlySystemAdmin {
        systemAdmins_.add(_newAdmin);
        // Emit
    }

    function removeAdmin(address _newAdmin) external onlyAdmin {
        admins_.remove(_newAdmin);
        // Emit
    }

    function removeSystemAdmin(address _newAdmin) external onlySystemAdmin {
        systemAdmins_.remove(_newAdmin);
        // Emit
    }

    function setReputationRewardEvent(address _utility, uint8 _id, uint256 _rewardAmount) external onlySystemAdmin{
        reputationRewards_[_utility][_id] = _rewardAmount;
        // EMIT
    }

    function issueReputationReward(address _member, uint8 _rewardId) external onlyUtility(msg.sender) returns (bool) {
        membershipState_[_member].reputation = membershipState_[_member].reputation.add(reputationRewards_[msg.sender][_rewardId]);
        // Emit
    }
  
    function stakeMembership(uint256 _daiValue, address _member) external returns(bool) {
        // uint256 requiredTokens = ITokenManager(tokenManager_).colateralToTokenSelling(_daiValue);
        // require(ITokenManager(tokenManager_).transferFrom(_member, address(this), requiredTokens), "Transfer was not complete");
        // if(membershipState_[_member].currentDate == 0){
        //     membershipState_[_member].currentDate = now;
        // }
        // membershipState_[_member].availableStake = membershipState_[_member].availableStake.add(requiredTokens);
        // // Emit event
        return true;
    }

    function manualTransfer(uint256 _tokenAmount, uint256 _index, address _member) external onlyUtility(msg.sender) returns (bool) {
        require(registeredUtility_[msg.sender].lockedStakePool[_index] >= _tokenAmount, "Insufficient tokens available");

        // Consider removing this if underflow issues
        registeredUtility_[msg.sender].contributions[_index][_member] = registeredUtility_[msg.sender].contributions[_index][_member].sub(_tokenAmount);


        registeredUtility_[msg.sender].lockedStakePool[_index] = registeredUtility_[msg.sender].lockedStakePool[_index].sub(_tokenAmount);
        membershipState_[_member].availableStake = membershipState_[_member].availableStake.add(_tokenAmount);
        
        // emit 
    }

    function withdrawMembership(uint256 _daiValue, address _member) external returns(bool) {
        uint256 withdrawAmount = ITokenManager(tokenManager_).colateralToTokenSelling(_daiValue);
        require(membershipState_[_member].availableStake >= withdrawAmount, "Not enough stake to fulfil request");
        membershipState_[_member].availableStake = membershipState_[_member].availableStake.sub(withdrawAmount);
        require(ITokenManager(tokenManager_).transfer(_member, withdrawAmount), "Transfer was not complete");
    }

    function lockCommitment(address _member, uint256 _index, uint256 _daiValue) external onlyUtility(msg.sender) returns (bool) {
        uint256 requiredTokens = ITokenManager(tokenManager_).colateralToTokenSelling(_daiValue);
        require(membershipState_[_member].availableStake >= requiredTokens, "Not enough available commitment");

        membershipState_[_member].availableStake = membershipState_[_member].availableStake.sub(requiredTokens);
        
        registeredUtility_[msg.sender].contributions[_index][_member] = registeredUtility_[msg.sender].contributions[_index][_member].add(requiredTokens);
        registeredUtility_[msg.sender].lockedStakePool[_index] = registeredUtility_[msg.sender].lockedStakePool[_index].add(requiredTokens);
        // Emit event

        return true;
    }

    function unlockCommitment(address _member, uint256 _index) external onlyUtility(msg.sender) returns (bool) {
        uint256 returnAmount = registeredUtility_[msg.sender].contributions[_index][_member];

        require(registeredUtility_[msg.sender].lockedStakePool[_index] >= returnAmount, "Insufficient tokens available");
        registeredUtility_[msg.sender].contributions[_index][_member] = 0;
        registeredUtility_[msg.sender].lockedStakePool[_index] = registeredUtility_[msg.sender].lockedStakePool[_index].sub(returnAmount);

        membershipState_[_member].availableStake = membershipState_[_member].availableStake.add(returnAmount);

        // Emit event
        return true;
    }

    function reputationOf(address _account) public view returns(uint256) {
        return (membershipState_[_account].reputation);
    }

    function getMembershipStatus(address _member) 
        public 
        view 
        returns(uint256, uint256, uint256)
    {
        return (
            membershipState_[_member].currentDate,
            membershipState_[_member].reputation,
            membershipState_[_member].availableStake
        );
    }

    function isRegistered(address _utility) external view returns(bool) {
        return registeredUtility_[_utility].active;
    }

    function getUtilityStake(address _utility, uint256 _index) external view returns(uint256) {
        return registeredUtility_[_utility].lockedStakePool[_index];
    }

    function getMemberUtilityStake(address _utility, address _member, uint256 _index) external view returns(uint256) {
        return registeredUtility_[_utility].contributions[_index][_member];
    }

    function getReputationRewardEvent(address _utility, uint8 _id) public view returns(uint256){
        return reputationRewards_[_utility][_id];
    }

    function tokenManager() external view returns(address) {
        return tokenManager_;
    }

}