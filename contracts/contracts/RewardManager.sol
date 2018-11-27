pragma solidity ^0.4.24;

import "./openzeppelin-solidity/token/ERC20/IERC20.sol";
import "./RewardIssuerInterface.sol";

contract RewardManager {
    mapping (address => bool) public approvedIssuer;

    mapping (address => uint256) public reputation;

    event RewardClaimed(address indexed account, uint256 amount);

    address internal admin;

    constructor() public{
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "User not authorised");
        _;
    }

    function addIssuer(address _issuer) public onlyAdmin{
        approvedIssuer[_issuer] = true;
    }

    function reputationOf(address _account) public view returns(uint256) {
        return (reputation[_account]);
    }

    /// Need to return struct to have dynamic reputation tracking
    function claimReward(address _issuer, uint256 _index) public {
        require(approvedIssuer[_issuer], "Moduled not authoried to reward");
        RewardIssuerInterface issuer = RewardIssuerInterface(_issuer);
        IERC20 token = IERC20(_issuer);
        uint256 payout = issuer.payout(msg.sender, _index);
        token.transfer(msg.sender, payout);    
        reputation[msg.sender] += 150; // To be dynamic with strut returns
        emit RewardClaimed(msg.sender, payout);
    }

}