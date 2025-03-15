import * as install from './install.js'
import * as manifest from './versions.manifest.js'
import * as semver from 'semver'

export const TOOL_NAME: string = 'sonar-scanner-cli'

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
export function getCliVersion(versionSpec: string): string {
  if (versionSpec === 'latest') {
    return manifest.CLI_VERSION_LATEST
  }

  // check if versionSpec is an explicit cli version
  if (manifest.CLI_VERSIONS.includes(versionSpec)) {
    return versionSpec
  }

  // evaluate version spec to find the closest match in semver
  for (const v of manifest.CLI_VERSIONS) {
    // skip 3.0.0.699 as it is not a valid semver (conflict with 3.0.0.702)
    if (v === '3.0.0.699') continue
    // check if a semver from cli version satisfies the version spec
    if (semver.satisfies(_transformToSemver(v), versionSpec)) {
      return v
    }
  }

  throw new Error(`No CLI version found for: ${versionSpec}`)
}

/**
 * Transforms a CLI version string to a semantic versioning (semver) format.
 *
 * @param cliVersion - The version string from the CLI.
 * @returns The version string in semver format (major.minor.patch).
 */
function _transformToSemver(cliVersion: string): string {
  return cliVersion.split('.').slice(0, 3).join('.')
}

/**
 * Transforms the given CLI version to a semantic version format.
 *
 * @param cliVersion - The version string of the CLI.
 * @returns The transformed semantic version string.
 */
export function getGhCacheVersion(cliVersion: string): string {
  return _transformToSemver(cliVersion)
}

/**
 * Retrieves the source URL and digest for a given SonarQube Scanner CLI version.
 *
 * @param cliVersion - The version of the SonarQube Scanner CLI.
 * @returns An object containing the URL and digest of the specified CLI version.
 */
export function getVersionSource(cliVersion: string): install.Source {
  const os = _getOsPlatform()
  if (cliVersion.startsWith('5.')) {
    const url = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${cliVersion}-${os}.zip`
    return {
      url: url,
      digest: `${url}.asc`
    }
  }

  const url = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${cliVersion}.zip`
  return {
    url: url,
    digest: `${url}.asc`
  }
}

function _getOsPlatform(): string {
  const os = process.platform
  if (os === 'win32') {
    return 'windows'
  } else if (os === 'darwin') {
    return 'macos'
  } else {
    return 'linux'
  }
}
