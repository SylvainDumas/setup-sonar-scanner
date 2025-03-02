import * as versions from '../src/versions'

describe('getVersionSource', () => {
  const originalPlatform = process.platform

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform })
  })

  it('should return the correct URL and digest for version 5.x.x.x on linux', () => {
    Object.defineProperty(process, 'platform', { value: 'linux' })
    const version = '5.0.0.2966'
    const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-linux.zip`
    const result = versions.getVersionSource(version)
    expect(result).toEqual({
      url: expectedUrl,
      digest: `${expectedUrl}.asc`
    })
  })

  it('should return the correct URL and digest for version 5.x.x.x on macos', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' })
    const version = '5.0.0.2966'
    const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-macos.zip`
    const result = versions.getVersionSource(version)
    expect(result).toEqual({
      url: expectedUrl,
      digest: `${expectedUrl}.asc`
    })
  })

  it('should return the correct URL and digest for version 5.x.x.x on windows', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const version = '5.0.0.2966'
    const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-windows.zip`
    const result = versions.getVersionSource(version)
    expect(result).toEqual({
      url: expectedUrl,
      digest: `${expectedUrl}.asc`
    })
  })

  it('should return the correct URL and digest for version 6.x.x.x on macos', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' })
    const version = '6.2.0.4584'
    const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip`
    const result = versions.getVersionSource(version)
    expect(result).toEqual({
      url: expectedUrl,
      digest: `${expectedUrl}.asc`
    })
  })

  it('should return the correct URL and digest for version 7.x.x.x on windows', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const version = '7.0.0.4796'
    const expectedUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip`
    const result = versions.getVersionSource(version)
    expect(result).toEqual({
      url: expectedUrl,
      digest: `${expectedUrl}.asc`
    })
  })

  it('should throw an error for unsupported version format', () => {
    const version = 'invalid-version'
    expect(() => versions.getVersionSource(version)).toThrow(
      `Unsupported version format: ${version}`
    )
  })
})

describe('toExplicitVersion', () => {
  it('should convert a valid version to explicit format', () => {
    const version = '1.2.3.4'
    const expected = '1.2.3'
    const result = versions.toExplicitVersion(version)
    expect(result).toBe(expected)
  })

  it('should throw an error for unsupported version format', () => {
    const version = '1.2.3'
    expect(() => versions.toExplicitVersion(version)).toThrow(
      `Unsupported version format: ${version}`
    )
  })

  it('should throw an error for another unsupported version format', () => {
    const version = '1.2'
    expect(() => versions.toExplicitVersion(version)).toThrow(
      `Unsupported version format: ${version}`
    )
  })

  it('should throw an error for a completely invalid version format', () => {
    const version = 'invalid-version'
    expect(() => versions.toExplicitVersion(version)).toThrow(
      `Unsupported version format: ${version}`
    )
  })
})
