import * as install from './install.js'

// TO THINK ABOUT: prefix tool name by adeo ?

export const TOOL_NAME: string = 'sonar-scanner-cli'

// system: linux, macos, windows
// arch: x86, x64

// 4.8.1.3023 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${os}.zip
// 5.0.0.2966 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${os}.zip
// 5.0.1.3006 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${os}.zip
// 6.0.0.4432
// 6.1.0.4477 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${system}-${arch}.zip
// 6.2.0.4584 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip
// 6.2.1.4610 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip
// 7.0.0.4796 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip
// 7.0.1.4817 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip
// 7.0.2.4839 https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip

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

/**
 * Checks if the given version string follows the SonarQube version format.
 *
 * The SonarQube version format is expected to be four sets of digits separated by dots (e.g., "1.2.3.4").
 *
 * @param version - The version string to check.
 * @returns `true` if the version string matches the SonarQube version format, otherwise `false`.
 */
export function isSonarVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+\.\d+$/.test(version)
}

/**
 * Converts a given version string to an explicit version format.
 * Ensures the version string is in a supported format and returns
 * the version truncated to three segments.
 *
 * @param version - The version string to convert.
 * @returns The explicit version string.
 * @throws {Error} If the version format is unsupported.
 */
export function toExplicitVersion(version: string): string {
  if (!isSonarVersion(version)) {
    throw new Error(`Unsupported version format: ${version}`)
  }
  return version.split('.').slice(0, 3).join('.')
}
