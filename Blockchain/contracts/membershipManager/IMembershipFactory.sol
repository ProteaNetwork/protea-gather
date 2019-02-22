pragma solidity >=0.5.3 < 0.6.0;

interface IMembershipFactory{
    // TODO: comments
    function deployMembershipModule(address _communityManager) external;
}