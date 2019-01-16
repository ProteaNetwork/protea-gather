pragma solidity ^0.4.24;

contract IRewardIssuer {
    function payout(address _member, uint256 _index) external returns(uint256);
}