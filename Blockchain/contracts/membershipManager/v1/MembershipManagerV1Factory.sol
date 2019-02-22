pragma solidity >=0.5.3 < 0.6.0;

import { MembershipManagerV1 } from "./MembershipManagerV1.sol";
import { BaseFactory } from "../../shared/interfaces/BaseFactory.sol";
import { IMembershipFactory } from "../IMembershipFactory.sol";

contract MembershipManagerV1Factory is BaseFactory, IMembershipFactory {
    function deployMembershipModule(address _communityManager) external onlyRootFactory() returns (address) {
        return address(new MembershipManagerV1(_communityManager));
    }
}