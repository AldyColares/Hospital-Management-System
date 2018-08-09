/**
 * @param {string} string The string will be used create new string.
 * @param {number} index The location of string will be permuted.
 * @param {string} replacement The valor permuted.
 * @returns {string} The new string.
 */ 

export default function(string, index, replacement) {
    return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}
