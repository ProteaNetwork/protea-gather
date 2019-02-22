pragma solidity >=0.5.3 < 0.6.0;

contract BaseFactory {
    address internal admin_;
    address internal rootFactory_;

    constructor(address _rootFactory) public {
        rootFactory_ = _rootFactory;
        admin_ = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin_, "Not authorised");
        _;
    }

    modifier onlyRootFactory() {
        require(msg.sender == rootFactory_, "Not authorised");
        _;
    }

    function updateRootFactory(address _newRoot) external onlyAdmin() {
        rootFactory_ = _newRoot;
    }
}