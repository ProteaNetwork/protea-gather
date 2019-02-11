pragma solidity ^0.5.2;

import "../utilities/EventManager.sol";
import "../membershipManager/RewardManager.sol";
import "../tokenManager/TokenManager.sol";

contract CommunityFactory {
    address internal admin;
    address internal daiAddress;

    struct Community {
        string name;
        address creator;
        address tokenManagerAddress;
        address rewardManagerAddress;
        address eventManagerAddress; // Consider removing
    }

    mapping(uint256 => Community) internal communities;
    uint256 internal numberOfCommunities = 0;

    event communityCreated(
        uint256 indexed index, 
        address indexed tokenManager, 
        address rewardManager, 
        address eventManager// Consider removing
    );

    constructor (address _daiTokenAddress) public {
        admin = msg.sender;
        daiAddress = _daiTokenAddress;
    }

    function createCommunity(
        string memory _communityName,
        string memory _communitySymbol
        
    )
        public
        returns(uint256)
    {
        address tokenManager = address(new TokenManager(
            _communityName,
            _communitySymbol,
            daiAddress
        ));
        address rewardManager = address(new RewardManager(
            tokenManager
        ));
        address eventManager = address(new EventManager(
            tokenManager,
            rewardManager,
            5
        ));

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
            string memory _name,
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