pragma solidity >=0.5.3 < 0.6.0;

/// @author Ryan @ Protea 
/// @title Community Factory interface for later expansion 
contract ICommunityFactory {
    struct Community {
        string name;
        address creator;
        address tokenManagerAddress;
        address membershipManagerAddress;
        address[] utilities; 
    }

    mapping(uint256 => Community) internal communities_;
    uint256 internal numberOfCommunities_ = 0;

    event CommunityCreated(
        address indexed publisher,
        uint256 index, 
        address indexed tokenManager, 
        address indexed membershipManager, 
        address[] utilities
    );

    /// @dev                            Allows the creation of a community
    /// @param _communityName           :string Name of the community
    /// @param _communitySymbol         :string Symbol of the community token
    /// @param _communityManager        :address The address of the super admin
    /// @param _gradientDemoninator     :uint256 The gradient modifier in the curve, not required in V1
    /// @param _contributionRate        :uint256 Percentage of incoming DAI to be diverted to the community account
    /// @return uint256                 Index of the deployed ecosystem
    /// @notice                         Also sets a super admin for changing factories at a later stage, unused at present
    /// @author Ryan
    function createCommunity(
        string memory _communityName,
        string memory _communitySymbol,
        address _communityManager,
        uint256 _gradientDemoninator,
        uint256 _contributionRate
    )
        public
        returns(uint256);

    /// @dev                            Fetches all data and contract addresses of deployed communities by index
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
        );
}