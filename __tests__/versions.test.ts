import * as versions from '../src/versions'
import * as manifest from '../src/versions.manifest'

describe('getCliVersion', () => {
  it('should return the latest version if the input is "latest"', () => {
    const version = 'latest'
    const result = versions.getCliVersion(version)
    expect(result).toBe(manifest.CLI_VERSION_LATEST)
  })

  const wellKnownVersions = ['7.0.2.4839', '6.2.0.4584', '5.0.0.2966']
  wellKnownVersions.forEach((version) => {
    it(`should return the requested version if it is a well-known version: ${version}`, () => {
      const result = versions.getCliVersion(version)
      expect(result).toBe(version)
    })
  })

  const expectedVersionByRange = {
    '>=5.0.0': manifest.CLI_VERSION_LATEST,
    '<6.0.0': '5.0.1.3006',
    '>=6.0.0 <7.0.0': '6.2.1.4610',
    '3.x': '3.4.0.1729',
    '3.0.x': '3.0.3.778',
    '3.0.0': '3.0.0.702',
    '5.1 || >=6.1 <7.0.0': '6.2.1.4610'
  }
  for (const [range, cliVersion] of Object.entries(expectedVersionByRange)) {
    it(`should return the expected version for the range: ${range} to be ${cliVersion}`, () => {
      const result = versions.getCliVersion(range)
      expect(result).toBe(cliVersion)
    })
  }

  const invalidVersions = ['invalid-version']
  for (const version of invalidVersions) {
    it(`should throw an error for unsupported version format: ${version}`, () => {
      expect(() => versions.getCliVersion(version)).toThrow(
        `No CLI version found for: ${version}`
      )
    })
  }
})

describe('getGhCacheVersion', () => {
  it('should return the version in major.minor.patch format', () => {
    const version = '1.2.3.4'
    const result = versions.getGhCacheVersion(version)
    expect(result).toBe('1.2.3')
  })
})

describe('getVersionSource', () => {
  const originalPlatform = process.platform

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform })
  })

  const platforms = {
    linux: 'linux',
    darwin: 'macos',
    win32: 'windows'
  }

  for (const [os, platform] of Object.entries(platforms)) {
    it(`should return the correct URL and digest for version 5.x.x.x on platform ${platform}`, () => {
      Object.defineProperty(process, 'platform', { value: os })
      const version = '5.0.0.2966'
      const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${platform}.zip`
      const result = versions.getVersionSource(version)
      expect(result).toEqual({
        url: expectedUrl,
        digest: `${expectedUrl}.asc`
      })
    })
  }

  for (const [os, platform] of Object.entries(platforms)) {
    it(`should return the correct URL and digest for version 6.x.x.x on platform ${platform}`, () => {
      Object.defineProperty(process, 'platform', { value: os })
      const version = '6.2.0.4584'
      const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip`
      const result = versions.getVersionSource(version)
      expect(result).toEqual({
        url: expectedUrl,
        digest: `${expectedUrl}.asc`
      })
    })
  }
})
