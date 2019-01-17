const math = require('mathjs');

/**
 * floatToUint256() takes in a floating point value,
 * and converts it into a Solidity compatible unsigned 256 bit integer
 *
 * @param {float} float - An unsigned float param
 * @param {int} decimal - An unsigned decimal param, indicating the decimal scaling to uint256
 * @return {int} A JS int formatted to uint256 constraints
 *
 * @example
 *
 *    floatToUint256(0.0125)
 *		floatToUint256(0.0125, 10)
 */

function floatToUint256(float, decimal = 18) {
		// Set precision of BigNumber to 77 from (2^256) - 1 = 10^x; x = approx. 77
		math.config({
			number: 'BigNumber', // Default type of number
			precision: 77        // Number of significant digits for BigNumbers
		});

		// Assert that the parameters are unsigned
		assert(math.sign(float) >= 0, "Parameter 'float' is negative signed");
		assert(math.sign(decimal) >= 0, "Parameter 'decimal' is negative signed");

		// Assert that the resulting uint256 value is less than (2^256)-1,
		// which is equivalent to a maximum decimal value of 77
		// Note: this doesn't prevent an overflow from a float that is too large
		assert(decimal > 0 && decimal <= 77, "Invalid parameter value 'decimal'");

		// Convert the result to a MathJS BigNumber
		let result = math.bignumber(float) * math.bignumber(math.pow(10, decimal));
		// Convert to uint, precision zero i.e. remove decimal places
		result = result.toPrecision();
    return result;
}

/**
 * A basic assert() function, to check a condition
 *
 * @param {boolean} condition - A boolean condition to check
 * @return {string} An error message to throw
 */

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

module.exports = {
    floatToUint256
};
