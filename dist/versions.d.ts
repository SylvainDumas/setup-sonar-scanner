import * as install from './install.js';
export declare const TOOL_NAME: string;
/**
 * Retrieves the source URL and digest for a given SonarQube scanner version.
 *
 * @param version - The version of the SonarQube scanner in the format x.x.x.x.
 * @returns An object containing the URL and digest of the SonarQube scanner.
 * @throws Will throw an error if the version format is unsupported.
 */
export declare function getVersionSource(version: string): install.Source;
/**
 * Checks if the given version string follows the SonarQube version format.
 *
 * The SonarQube version format is expected to be four sets of digits separated by dots (e.g., "1.2.3.4").
 *
 * @param version - The version string to check.
 * @returns `true` if the version string matches the SonarQube version format, otherwise `false`.
 */
export declare function isSonarVersion(version: string): boolean;
/**
 * Converts a given version string to an explicit version format.
 * Ensures the version string is in a supported format and returns
 * the version truncated to three segments.
 *
 * @param version - The version string to convert.
 * @returns The explicit version string.
 * @throws {Error} If the version format is unsupported.
 */
export declare function toExplicitVersion(version: string): string;
