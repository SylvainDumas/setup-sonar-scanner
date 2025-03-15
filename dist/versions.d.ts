import * as install from './install.js';
export declare const TOOL_NAME: string;
/**
 * Retrieves the CLI version based on the provided version specification.
 *
 * @param versionSpec - The version specification, which can be:
 *   - 'latest' to get the latest CLI version.
 *   - An explicit CLI version string.
 *   - A version range or other semver-compatible specification.
 * @returns The CLI version that matches the provided specification.
 * @throws Will throw an error if no matching CLI version is found.
 */
export declare function getCliVersion(versionSpec: string): string;
/**
 * Transforms the given CLI version to a semantic version format.
 *
 * @param cliVersion - The version string of the CLI.
 * @returns The transformed semantic version string.
 */
export declare function getGhCacheVersion(cliVersion: string): string;
/**
 * Retrieves the source URL and digest for a given SonarQube Scanner CLI version.
 *
 * @param cliVersion - The version of the SonarQube Scanner CLI.
 * @returns An object containing the URL and digest of the specified CLI version.
 */
export declare function getVersionSource(cliVersion: string): install.Source;
