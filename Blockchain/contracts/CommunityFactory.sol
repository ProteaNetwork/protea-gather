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

    event communityCreated(
        uint256 indexed index, 
        address indexed tokenManager, 
        address rewardManager, 
        address eventManager
    );

    constructor (address _daiTokenAddress) public {
        admin = msg.sender;
        daiAddress = _daiTokenAddress;
    }

    function createCommunity(
        string _communityName,
        string _communitySymbol
        
    )
        public
        returns(uint256)
    {
        address tokenManager = new TokenManager(
            _communityName,
            _communitySymbol,
            daiAddress
        );
        address rewardManager = new RewardManager(
            tokenManager
        );
        address eventManager = new EventManager(
            tokenManager,
            rewardManager,
            5
        );

        uint256 index = numberOfCommunities;

        communities[index] = Community({
            name: _communityName,
            creator: msg.sender,
            tokenManagerAddress: tokenManager,
            rewardManagerAddress: rewardManager,
            eventManagerAddress: eventManager
        });

        numberOfCommunities++;

        emit communityCreated(
            index, 
            tokenManager, 
            rewardManager, 
            eventManager
        );

        return index;
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

}