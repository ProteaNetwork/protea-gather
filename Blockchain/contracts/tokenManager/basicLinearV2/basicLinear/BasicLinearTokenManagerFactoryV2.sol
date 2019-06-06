pragma solidity 0.5.4;

import { BasicLinearTokenManagerV2 } from "./BasicLinearTokenManagerV2.sol";
import { BaseFactory } from "../../../shared/baseContracts/BaseFactory.sol";
import { ITokenManagerFactory } from "../../basicLinearV1/ITokenManagerFactoryV1.sol";

contract BasicLinearTokenManagerFactoryV2 is BaseFactory, ITokenManagerFactory {
    constructor(address _rootFactory) public BaseFactory(_rootFactory) {

    }
    
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
            new BasicLinearTokenManagerV2(
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