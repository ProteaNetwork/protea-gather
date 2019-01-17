pragma solidity ^0.5.2;

interface ERC223Receiver { 
    function tokenFallback(address _from, uint _value, bytes calldata _data) external;
}