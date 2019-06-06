pragma solidity >=0.5.3 < 0.6.0;

import { BaseTokenManager } from "../basicLinearV1/BaseTokenManagerV1.sol";


/// @author Ben, Veronica & Ryan of Linum Labs
/// @author Ryan N.                 RyRy79261
/// @title Basic Linear Token Manager
contract BaseTokenManagerV2 is BaseTokenManager {
    event ContributionTargetUpdated(address newTarget);

    constructor(
        string memory _name,
        string memory _symbol,
        address _reserveToken,
        address _proteaAccount,
        address _publisher,
        uint256 _contributionRate,
        address _membershipManager
    )
        public
        BaseTokenManager(_name, _symbol, _reserveToken, _proteaAccount, _publisher, _contributionRate, _membershipManager)
    {}

    /// @dev                This updates the revenue target for custom targets
    /// @param _newTarget   :address The address of the new target
    /// @return             A bool for safe execution
    function changeContributionTarget(
        address _newTarget
    )
        external
        onlyAdmin()
        returns(bool)
    {
        revenueTarget_ = _newTarget;
        emit ContributionTargetUpdated(_newTarget);
        return true;
    }
}