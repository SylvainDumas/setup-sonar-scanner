import * as install from './install.js';
export declare const TOOL_NAME: string;
/**
 * Retrieves the CLI version if the requested version is in a supported format.
 *
 * @param requested - The version string requested by the user.
 * @returns The requested version string if it is in a supported format.
 * @throws {Error} If the requested version format is unsupported.
 */
export declare function getCliVersion(requested: string): string;
/**
 * Extracts the major, minor, and patch version from a given version string.
 *
 * @param version - The version string to process.
 * @returns The version string in the format "major.minor.patch".
 * @throws If the version format is unsupported.
 */
export declare function getGhCacheVersion(version: string): string;
/**
 * Retrieves the source URL and digest for a given SonarQube scanner version.
 *
 * @param version - The version of the SonarQube scanner in the format x.x.x.x.
 * @returns An object containing the URL and digest of the SonarQube scanner.
 * @throws Will throw an error if the version format is unsupported.
 */
export declare function getVersionSource(version: string): install.Source;
