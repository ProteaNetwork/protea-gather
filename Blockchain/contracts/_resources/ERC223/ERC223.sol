pragma solidity ^0.5.2;

import "../openzeppelin-solidity/token/ERC20/IERC20.sol";

contract ERC223 is IERC20 {
    function transfer(address to, uint value, bytes memory data) public;
}
