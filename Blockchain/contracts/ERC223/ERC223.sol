pragma solidity ^0.4.18;

import "../openzeppelin-solidity/token/ERC20/IERC20.sol";

contract ERC223 is IERC20 {
    function transfer(address to, uint value, bytes data) public;
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}
