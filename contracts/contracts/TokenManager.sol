pragma solidity ^0.4.24;

import "./ERC223/ERC223.sol";
import "./openzeppelin-solidity/token/ERC20/IERC20.sol";
import "./openzeppelin-solidity/math/SafeMath.sol";

contract TokenManager is ERC223 {
    using SafeMath for uint256;
    uint256 internal totalSupply_;
    uint256 public poolBalance;
    string public name;
    bytes32 public symbol;
    uint256 public gradient = 2.5*10**14; //NB: this must be a gradient of wei/tokens
    uint256 public decimals = 10**18; //For now, assume Eth as base collateral
    address public reserveToken;

    mapping(address => uint256) internal balances;
    mapping (address => mapping (address => uint256)) internal allowed;

    event Approval(
      address indexed owner,
      address indexed spender,
      uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint value);
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
    event Minted(uint256 amount, uint256 totalCost);
    event Burned(uint256 amount, uint256 reward);

    constructor(
        string _name,
        bytes32 _symbol,
        address _reserveToken
    ) 
        public
    {
        name = _name;
        symbol = _symbol;
        reserveToken = _reserveToken;
    }

    function totalSupply() 
        public 
        view
        returns (uint256 _totalSupply) 
    {
        return totalSupply_;
    }

    function allowance(address _owner, address _spender) 
        public 
        view 
        returns (uint256) 
    {
        return allowed[_owner][_spender];
    }

    /**
      * @dev Transfer tokens from one address to another
      * @param _from     : address The address which you want to send tokens from
      * @param _to       : address The address which you want to transfer to
      * @param _value    : uint256 the amount of tokens to be transferred
      */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        returns (bool success)
    {
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);
        require(_to != address(0));

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        // allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        totalSupply_ = totalSupply_.add(_value);
        emit Transfer(_from, _to, _value);
        success = true;
    } 
    
    function approve(
        address _spender, 
        uint256 _value
    ) 
        public 
        returns (bool success) 
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        success = true;
    }

    function balanceOf(address _owner) 
        public 
        view
        returns (uint256 balance) 
    {
        return balances[_owner];
    }

    function transfer(
        address _to, 
        uint256 _value
    ) 
        public 
        returns (bool success) 
    {
        require(_value <= balances[msg.sender]);
        require(_to != address(0));

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function transfer(address _to, uint _value, bytes _data) public {
        require(this.call(_data));
    }

    /// @dev        Calculate the integral from 0 to x tokens supply
    /// @param x    The number of tokens supply to integrate to
    /// @return     The total supply in tokens, not wei
    function curveIntegral(uint256 x) internal view returns (uint256) {
        // y = gradient*x + c
        uint256 c = 0;

        // We'd ideally (for a nice curve, and easy values to work with?)
        // like 20 tokens to be priced at $1, or some gradient in that range

        // $1 in Eth is approx 0.005
        // 0.005 Eth is 5*10**15 wei

        // So the gradient we want, working with wei, is y/x=wei/tokens, or 5*10**15/20 = 2.5*10**14
        // We must remember to define gradient in wei, and convert after ~ we can't work with floating points

        // Calculate integral of y = gradient*x + c >> 0.5mx^2 + cx; where c = 0
        // 1 Ether is 10**18 wei, which gives 18 decimal places to work with
        uint256 thing = gradient.mul(x**2).div(2) + c.mul(x);
        return thing.div(10**14);
        //return decimals*mul(gradient, x**2).div(2*decimals) + mul(c, x);
    }

    /// @return  Price, in wei, for mint
    function priceToMint(uint256 numTokens) public view returns(uint256) {
        return curveIntegral(totalSupply_.add(numTokens)).sub(poolBalance);
    }

    /// @return  Reward, in wei, for burn
    function rewardForBurn(uint256 numTokens) public view returns(uint256) {
        return poolBalance.sub(curveIntegral(totalSupply_.sub(numTokens)));
    }

    /// @dev                    Burn tokens to receive ether
    /// @param numTokens        The number of tokens that you want to burn
    /// @dev rewardForTokens    Value in wei, for tokens burned
    function burn(uint256 numTokens) public {
        require(balances[msg.sender] >= numTokens);

        uint256 rewardForTokens = rewardForBurn(numTokens);
        totalSupply_ = totalSupply_.sub(numTokens);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        poolBalance = poolBalance.sub(rewardForTokens);
        require(
            IERC20(reserveToken).transfer(msg.sender, rewardForTokens), 
            "Require transferFrom to succeed"
        );

        emit Burned(numTokens, rewardForTokens);
    }

    /// @dev                    Mint new tokens with ether
    /// @param numTokens        The number of tokens you want to mint
    /// @dev priceForTokens     Value in wei, for tokens minted
    /// Notes: We have modified the minting function to tax the purchase tokens
    /// This behaves as a sort of stake on buyers to participate even at a small scale
    function mint(uint256 numTokens) public {
        uint256 priceForTokens = priceToMint(numTokens);
        require(
            IERC20(reserveToken).transferFrom(msg.sender, this, priceForTokens), 
            "Require transferFrom to succeed"
        );
        totalSupply_ = totalSupply_.add(numTokens);
        poolBalance = poolBalance.add(priceForTokens);
        balances[msg.sender] = balances[msg.sender].add(numTokens);

        emit Minted(numTokens, priceForTokens);
    }
}