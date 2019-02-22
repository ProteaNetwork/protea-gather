pragma solidity >=0.5.3 < 0.6.0;

import { BasicLinearTokenManager } from "./BasicLinearTokenManager.sol";
import { BaseFactory } from "../../shared/interfaces/BaseFactory.sol";
import { ITokenManagerFactory } from "../ITokenManagerFactory.sol";

contract BasicLinearTokenManagerFactory is BaseFactory, ITokenManagerFactory {
    function deployMarket(
        string calldata _name,
        string calldata _symbol,
        address _reserveToken,
        address _proteaAccount,
        address _publisher,
        uint256 _contributionRate,
        address _membershipManager
    ) external onlyRootFactory() returns (address) {
        return address(
            new BasicLinearTokenManager(
                _name,
                _symbol,
                _reserveToken,
                _proteaAccount,
                _publisher,
                _contributionRate,
                _membershipManager
            )
        );
    }
}