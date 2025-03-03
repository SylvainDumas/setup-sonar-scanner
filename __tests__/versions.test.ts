import * as versions from '../src/versions'

describe('getCliVersion', () => {
  it('should return the requested version if it is in a supported format', () => {
    const version = '1.2.3.4'
    const result = versions.getCliVersion(version)
    expect(result).toBe(version)
  })

  const invalidVersions = ['1.2.3', '1.2', 'invalid-version']
  invalidVersions.forEach((version) => {
    it(`should throw an error for unsupported version format: ${version}`, () => {
      expect(() => versions.getCliVersion(version)).toThrow(
        `Unsupported version format: ${version}`
      )
    })
  })
})

describe('getGhCacheVersion', () => {
  it('should return the version in major.minor.patch format', () => {
    const version = '1.2.3.4'
    const result = versions.getGhCacheVersion(version)
    expect(result).toBe('1.2.3')
  })

  const invalidVersions = ['1.2.3', '1.2', 'invalid-version']
  invalidVersions.forEach((version) => {
    it(`should throw an error for unsupported version format: ${version}`, () => {
      expect(() => versions.getGhCacheVersion(version)).toThrow(
        `Unsupported version format: ${version}`
      )
    })
  })
})

describe('getVersionSource', () => {
  const originalPlatform = process.platform

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform })
  })

  it('should throw an error for unsupported version format', () => {
    const version = 'invalid-version'
    expect(() => versions.getVersionSource(version)).toThrow(
      `Unsupported version format: ${version}`
    )
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
