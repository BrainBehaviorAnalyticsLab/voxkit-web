/**
 * Utility functions for validating feedback codes.
 * Codes are stored in FEEDBACK_CODES env variable as comma-separated values.
 */

/**
 * Get the list of valid feedback codes from environment variable.
 */
export function getValidCodes(): string[] {
  const codesString = process.env.FEEDBACK_CODES || '';
  return codesString
    .split(',')
    .map((code) => code.trim())
    .filter((code) => code.length === 5 && /^\d{5}$/.test(code));
}

/**
 * Check if a given code is valid.
 */
export function isValidCode(code: string): boolean {
  if (!code || code.length !== 5 || !/^\d{5}$/.test(code)) {
    return false;
  }
  const validCodes = getValidCodes();
  return validCodes.includes(code);
}
