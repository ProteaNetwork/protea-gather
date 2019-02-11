pragma solidity ^0.5.2;

import "../_resources/ERC223/ERC223.sol";
import "../_resources/ERC223/ERC223Receiver.sol";
import "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";
import "../_resources/openzeppelin-solidity/math/SafeMath.sol";

contract TokenManager  /* is ERC223*/ {
    using SafeMath for uint256;

    address public reserveToken;

    uint256 internal totalSupply_;
    uint256 public poolBalance;
    
    string private name;
    string private symbol;
    uint256 private gradientDenominator = 2000; // numerator/denominator DAI/Token
    uint256 private decimals = 10**18; // For now, assume 10^18 decimal precision

    mapping (address => mapping (address => uint256)) internal allowed;
    mapping(address => uint256) internal balances;

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
        string memory _name,
        string memory _symbol,
        address _reserveToken
    ) 
        public
    {
        name = _name;
        symbol = _symbol;
        reserveToken = _reserveToken;
    }

    
    /**
      * @dev Transfer ownership token from msg.sender to a specified address
      * @param _to The address to transfer to.
      * @param _value The amount to be transferred.
      */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender]);
        require(_to != address(0));

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
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
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        totalSupply_ = totalSupply_.add(_value);
        emit Transfer(_from, _to, _value);
        success = true;
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
    /// @dev rewardForTokens    Value in DAI, for tokens burned
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
    /// @dev priceForTokens     Value in DAI, for tokens minted
    /// Notes: We have modified the minting function to tax the purchase tokens
    /// This behaves as a sort of stake on buyers to participate even at a small scale
    function mint(uint256 numTokens) public {
        uint256 priceForTokens = priceToMint(numTokens);
        require(
            IERC20(reserveToken).transferFrom(msg.sender, address(this), priceForTokens), 
            "Require transferFrom to succeed"
        );
        totalSupply_ = totalSupply_.add(numTokens);
        poolBalance = poolBalance.add(priceForTokens);
        balances[msg.sender] = balances[msg.sender].add(numTokens);

        emit Minted(numTokens, priceForTokens);
    }

    function allowance(address _owner, address _spender) 
        public 
        view 
        returns (uint256) 
    {
        return allowed[_owner][_spender];
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

    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *      Invokes the `tokenFallback` function if the recipient is a contract.
     *      The token transfer fails if the recipient is a contract
     *      but does not implement the `tokenFallback` function
     *      or the fallback function to receive funds.
     *
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     * @param _data  Transaction metadata.
    */
    function transfer(address _to, uint _value, bytes memory _data) public {
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        ERC223Receiver receiver = ERC223Receiver(_to);
        receiver.tokenFallback(msg.sender, _value, _data);

        emit Transfer(msg.sender, _to, _value);
    }

    /**
      * @dev Gets the balance of the specified address.
      * @param _owner The address to query the the balance of.
      * @return An uint256 representing the amount owned by the passed address.
      */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    /**
      * @dev Total number of tokens in existence
      */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /// @dev        Calculate the integral from 0 to x tokens supply
    /// @param x    The number of tokens supply to integrate to
    /// @return     The total supply in tokens, not wei
    function curveIntegral(uint256 x) internal view returns (uint256) {
        /** This is the formula for the curve
            f(x) = gradient*(x + b) + c
            f(x) indicates it is a function of x, where x is the token supply
            the gradient is the gradient of the curve i.e. the change in price over the change in token supply
            c is the y-offset, which is set to 0 for now.
            For more information visit:
            https://en.wikipedia.org/wiki/Linear_function
        */

        uint256 c = 0;

        /* The gradient of a curve is the rate at which it increases its slope.
	    	For example, to increase at a value of 5 DAI for every 1 token,
	    	our gradient would be (change in y)/(change in x) = 5/1 = 5 DAI/Token
	    	Remember that contracts deal with uint256 integers with 18 decimal points, not floating points, so:
	    	to represent our gradient of 0.0005 DAI/Token, we simply divide by the denominator, to avoid floating points,
	    	so we end up with 1/0.0005 = 2000 as our denominator.
	    */

        /* We need to calculate the definite integral from zero to the defined token supply, x.
	    	A definite integral is essentially the area under the curve, from zero to the defined token supply.
	    	The area under the curve is equivalent to the value of the tokens up until that point.
	    	The integral of the linear curve, f(x), is calculated as:
	    	gradient*0.5*x^2 + cx; where c = 0
	    	Because we are essentially squaring the decimal scaling in the calculation,
	    	we need to divide the result by the scaling factor before returning - this hurt my mind a bit, but mathematically holds true.
	    */
        return ((x**2).div(2*gradientDenominator) + c.mul(x)).div(decimals);
    }

    
}