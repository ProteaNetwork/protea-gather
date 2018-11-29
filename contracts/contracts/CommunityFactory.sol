pragma solidity ^0.4.24;

import "./EventManager.sol";
import "./RewardManager.sol";
import "./TokenManager.sol";

contract CommunityFactory {

    address public admin;
    address public daiAddress;
    struct Community {
        string name;
        address creator;
        address tokenManagerAddress;
        address rewardManagerAddress;
        address eventManagerAddress;
    }

    mapping(uint256 => Community) internal communities;
    uint256 internal numberOfCommunities = 0;
    uint256[] allCommunitiesIndex;

    event communityCreated(
        uint256 index, 
        address indexed tokenManager, 
        address indexed rewardManager, 
        address indexed eventManager
    );

    constructor (address _daiTokenAddress) public {
        admin = msg.sender;
        daiAddress = _daiTokenAddress;
    }

    function createCommunity(
        string _communityName,
        string _communityTokenName,
        bytes32 _communityTokenSymbol
        
    )
        public
        returns(uint256)
    {
        address tokenManager = new TokenManager(
            _communityTokenName,
            _communityTokenSymbol,
            daiAddress
        );
        address rewardManager = new RewardManager();
        address eventManager = new EventManager(
            tokenManager,
            rewardManager,
            20,
            5
        );
        numberOfCommunities++;
        communities[numberOfCommunities] = Community({
            name: _communityName,
            creator: msg.sender,
            tokenManagerAddress: tokenManager,
            rewardManagerAddress: rewardManager,
            eventManagerAddress: eventManager
        });
        allCommunitiesIndex.push(numberOfCommunities);

        emit communityCreated(
            numberOfCommunities, 
            tokenManager, 
            rewardManager, 
            eventManager
        );
        return numberOfCommunities;
    }

    function getCommunity(uint256 _index)
        public
        view
        returns(
            string _name,
            address _creator,
            address _tokenManagerAddress,
            address _rewardManagerAddress,
            address _eventManagerAddress
        )
    {
        _name = communities[_index].name;
        _creator = communities[_index].creator;
        _eventManagerAddress = communities[_index].eventManagerAddress;
        _rewardManagerAddress = communities[_index].rewardManagerAddress;
        _tokenManagerAddress = communities[_index].tokenManagerAddress;
    }

    function getAllCommunityIndexes()
        public
        view 
        returns(uint256[])
    {
        return allCommunitiesIndex;
    }
}