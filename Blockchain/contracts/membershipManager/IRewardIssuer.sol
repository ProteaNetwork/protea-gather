pragma solidity ^0.5.2;

contract IRewardIssuer {
    function payout(address _member, uint256 _index) external returns(uint256);
}