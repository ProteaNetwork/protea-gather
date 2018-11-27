pragma solidity ^0.4.24;

contract RewardIssuerInterface {
    function payout(address _member, uint256 _index) external view returns(uint256);
}