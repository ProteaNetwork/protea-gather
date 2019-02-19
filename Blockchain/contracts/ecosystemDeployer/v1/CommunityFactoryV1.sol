pragma solidity >=0.5.3 < 0.6.0;

import "../../tokenManager/basicLinear/BasicLinearTokenManager.sol";
import "../../membershipManager/v1/MembershipManager.sol";
import "../../utilities/eventManager/v1/EventManager.sol";
import "../ICommunityFactory.sol";

/// @author Ryan @ Protea 
/// @title V1 Community ecosystem factory
contract CommunityFactoryV1 is ICommunityFactory{
    address internal admin_;
    address internal daiAddress_;
    address internal proteaAccount_;

    /// @notice                         Constructor of V1 factory
    /// @param _daiTokenAddress         Address of the DAI token account
    /// @param _proteaAccount           Address of the Protea DAI account
    /// @dev                            Also sets a super admin for changing factories at a later stage, unused at present
    /// @author Ryan                
    constructor (address _daiTokenAddress, address _proteaAccount) public {
        admin_ = msg.sender;
        daiAddress_ = _daiTokenAddress;
        proteaAccount_ = _proteaAccount;
    }

    /// @notice                         Allows the creation of a community
    /// @param _communityName           :string Name of the community
    /// @param _communitySymbol         :string Symbol of the community token
    /// @param _communityManager        :address The address of the super admin
    /// @param _contributionRate        :uint256 Percentage of incoming DAI to be diverted to the community account, from 0 to 100
    /// @return uint256                 Index of the deployed ecosystem
    /// @dev                            Also sets a super admin for changing factories at a later stage, unused at present
    /// @author Ryan
    function createCommunity(
        string memory _communityName,
        string memory _communitySymbol,
        address _communityManager,
        uint256 _contributionRate
    )
        public
        returns(uint256)
    {
        address membershipManagerAddress = address(
            new MembershipManager(
                _communityManager
        ));

        address tokenManagerAddress = address(
            new BasicLinearTokenManager(
                _communityName,
                _communitySymbol,
                daiAddress_,
                proteaAccount_,
                _communityManager,
                _contributionRate,
                membershipManagerAddress
        ));

        address eventManagerAddress = address( 
            new EventManager(
                tokenManagerAddress,
                membershipManagerAddress
        ));

    // TODO: check set up on membership
        uint256 index = numberOfCommunities_;
        numberOfCommunities_ = numberOfCommunities_ + 1;
        
        communities_[index].name = _communityName;
        communities_[index].creator = msg.sender;
        communities_[index].tokenManagerAddress = tokenManagerAddress;
        communities_[index].membershipManagerAddress = membershipManagerAddress;
        communities_[index].utilities.push(eventManagerAddress);

        emit CommunityCreated(
            msg.sender,
            index, 
            tokenManagerAddress, 
            membershipManagerAddress, 
            communities_[index].utilities
        );

        return index;
    }

    /// @notice                         Fetches all data and contract addresses of deployed communities by index
    /// @param _index                   :uint256 Index of the community
    /// @return Community               Returns a Community struct matching the provided index
    /// @author Ryan
    function getCommunity(uint256 _index)
        public
        view
        returns(
            string memory,
            address,
            address,
            address,
            address[] memory
        )
    {
        return (
            communities_[_index].name,
            communities_[_index].creator,
            communities_[_index].membershipManagerAddress,
            communities_[_index].tokenManagerAddress,
            communities_[_index].utilities
        );
    }

}