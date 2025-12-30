export default abstract class CharUtils {
  /**
   * Normalizes a string by decomposing accented characters into their basic forms
   * and removing non-ASCII characters.
   * @param {string} string - The input string to be normalized.
   * @returns {string} The normalized string.
   */
  static normalize(string: string) {
    // eslint-disable-next-line no-control-regex
    return string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]|[^\u0000-\u00FF]/g, '');
  }

  /**
   * Encodes a string by replacing the close parenthesis character with its percent-encoded equivalent.
   * @param {string} str - The input string to be encoded.
   * @returns {string} The encoded string.
   */
  static encodeCloseParenthesis(str: string) {
    return str.replace(/\)/g, '%29');
  }

  /**
   * Decodes a string by replacing the percent-encoded close parenthesis character with the actual character.
   * @param {string} str - The input string to be decoded.
   * @returns {string} The decoded string.
   */
  static decodeCloseParenthesis(str: string) {
    return str.replace(/%29/g, ')');
  }
}
