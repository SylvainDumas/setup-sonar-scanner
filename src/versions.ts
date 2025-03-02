import * as install from './install.js'

export const TOOL_NAME: string = 'sonar-scanner-cli'

/**
 * Retrieves the CLI version if the requested version is in a supported format.
 *
 * @param requested - The version string requested by the user.
 * @returns The requested version string if it is in a supported format.
 * @throws {Error} If the requested version format is unsupported.
 */
export function getCliVersion(requested: string): string {
  if (!isSonarVersion(requested)) {
    throw new Error(`Unsupported version format: ${requested}`)
  }
  return requested
}

/**
 * Extracts the major, minor, and patch version from a given version string.
 *
 * @param version - The version string to process.
 * @returns The version string in the format "major.minor.patch".
 * @throws If the version format is unsupported.
 */
export function getGhCacheVersion(version: string): string {
  if (!isSonarVersion(version)) {
    throw new Error(`Unsupported version format: ${version}`)
  }
  return version.split('.').slice(0, 3).join('.')
}

/**
 * Checks if the given version string follows the SonarQube version format.
 *
 * The SonarQube version format is expected to be four sets of digits separated by dots (e.g., "1.2.3.4").
 *
 * @param version - The version string to check.
 * @returns `true` if the version string matches the SonarQube version format, otherwise `false`.
 */
function isSonarVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+\.\d+$/.test(version)
}

/**
 * Retrieves the source URL and digest for a given SonarQube scanner version.
 *
 * @param version - The version of the SonarQube scanner in the format x.x.x.x.
 * @returns An object containing the URL and digest of the SonarQube scanner.
 * @throws Will throw an error if the version format is unsupported.
 */
export function getVersionSource(version: string): install.Source {
  // check if version is in the format x.x.x.x
  if (!isSonarVersion(version)) {
    throw new Error(`Unsupported version format: ${version}`)
  }

  const os = _getOsPlatform()
  if (version.startsWith('5.')) {
    const url = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${os}.zip`
    return {
      url: url,
      digest: `${url}.asc`
    }
  }

  const url = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip`
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
