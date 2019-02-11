pragma solidity ^0.5.2;

import "../_resources/ERC223/ERC223.sol";
import "../_resources/ERC223/ERC223Receiver.sol";
import "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";
import "../_resources/openzeppelin-solidity/math/SafeMath.sol";

interface ITokenManager {
    event Approval(
      address indexed owner,
      address indexed spender,
      uint256 value
    );

    event Transfer(address indexed from, address indexed to, uint value);
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
    
    event Minted(uint256 amount, uint256 totalCost);
    event Burned(uint256 amount, uint256 reward);

    /**
      * @dev Transfer ownership token from msg.sender to a specified address
      * @param _to The address to transfer to.
      * @param _value The amount to be transferred.
      */
    function transfer(address _to, uint256 _value) external returns (bool);

    /**
      * @dev Transfer tokens from one address to another
      * @param _from     : address The address which you want to send tokens from
      * @param _to       : address The address which you want to transfer to
      * @param _value    : uint256 the amount of tokens to be transferred
      */
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

    /// @return  Price, in wei, for mint
    function priceToMint(uint256 numTokens) external view returns(uint256);

    /// @return  Reward, in wei, for burn
    function rewardForBurn(uint256 numTokens) external view returns(uint256);

    /// @dev                    Burn tokens to receive ether
    /// @param numTokens        The number of tokens that you want to burn
    /// @dev rewardForTokens    Value in DAI, for tokens burned
    function burn(uint256 numTokens) external;

    /// @dev                    Mint new tokens with ether
    /// @param numTokens        The number of tokens you want to mint
    /// @dev priceForTokens     Value in DAI, for tokens minted
    /// Notes: We have modified the minting function to tax the purchase tokens
    /// This behaves as a sort of stake on buyers to participate even at a small scale
    function mint(uint256 numTokens) external;

    function allowance(address _owner, address _spender) external view returns (uint256);
    
    function approve(address _spender, uint256 _value) external returns (bool success);

    /**
      * @dev Gets the balance of the specified address.
      * @param _owner The address to query the the balance of.
      * @return An uint256 representing the amount owned by the passed address.
      */
    function balanceOf(address _owner) external view returns (uint256);
    /**
      * @dev Total number of tokens in existence
      */
    function totalSupply() external view returns (uint256);

}