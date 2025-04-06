import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core'
import * as tc from '../__fixtures__/tool-cache'
import * as install from '../__fixtures__/install'
import * as versions from '../src/versions'
//import io from '@actions/io'
//import { mkTempDir } from './tools'
//import * as install from '../src/install'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/tool-cache', () => tc)
jest.unstable_mockModule('../src/install', () => install)

//import type * as install from '../src/install'
//const downloadTool = jest.fn<typeof install.downloadTool>()
//jest.mock('../src/install', () => install)

/*
import { downloadTool } from '../src/install'
jest.mock('../src/install', () => ({
  downloadTool: jest.fn().mockReturnValue('/path/to/sonar-scanner')
}))
*/

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main')

describe('run', () => {
  //const originalRunnerTemp = process.env['RUNNER_TEMP']
  //const tempPath = '/workspaces/setup-sonar-scanner/.local/runner/tmp' //mkTempDir()

  //const originalRunnerToolCache = process.env['RUNNER_TOOL_CACHE']
  //const cachePath = '.local/runner/cache' //mkTempDir()

  beforeAll(async () => {
    //process.env['RUNNER_TEMP'] = tempPath
    //process.env['RUNNER_TOOL_CACHE'] = cachePath
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    //await io.mkdirP(cachePath)
    //await io.mkdirP(tempPath)
  })

  afterEach(async () => {
    //await io.rmRF(tempPath)
    //await io.rmRF(cachePath)
    //nock.cleanAll()
  })

  afterAll(() => {
    //process.env['RUNNER_TEMP'] = originalRunnerTemp
    //process.env['RUNNER_TOOL_CACHE'] = originalRunnerToolCache
  })

  it('Check version not supported', async () => {
    core.getInput.mockImplementation((name: string) =>
      name === 'version' ? '1.0.0' : ''
    )

    await expect(run()).resolves.not.toThrow()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Action failed with error Error: No CLI version found for: 1.0.0'
    )
  })

  it('Check version find in cache', async () => {
    core.getInput.mockImplementation((name: string) =>
      name === 'version' ? '7.0.2.4839' : ''
    )
    const fakePath = '/path/to/sonar-scanner'
    tc.find.mockReturnValue(fakePath)

    await expect(run()).resolves.not.toThrow()

    expect(core.getInput).toHaveBeenCalledWith('version')
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(tc.find).toHaveBeenCalledWith(versions.TOOL_NAME, '7.0.2')
    expect(tc.cacheDir).not.toHaveBeenCalled()
    expect(core.addPath).toHaveBeenCalledWith(`${fakePath}/bin`)
  })

  it('Check version not found in cache', async () => {
    const version = '7.0.2.4839'
    core.getInput.mockImplementation((name: string) =>
      name === 'version' ? version : ''
    )
    tc.find.mockReturnValue('')
    const expectedVersionUrl = `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip`
    const fakeDownloadPath = '/path/to/download'
    install.downloadTool.mockResolvedValue(fakeDownloadPath)
    const fakeCachedPath = '/path/to/cache'
    tc.cacheDir.mockResolvedValue(fakeCachedPath)

    await expect(run()).resolves.not.toThrow()

    expect(core.getInput).toHaveBeenCalledWith('version')
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(tc.find).toHaveBeenCalledWith(versions.TOOL_NAME, '7.0.2')
    expect(install.downloadTool).toHaveBeenCalledWith({
      digest: `${expectedVersionUrl}.asc`,
      url: expectedVersionUrl
    })
    expect(tc.cacheDir).toHaveBeenCalledWith(
      fakeDownloadPath,
      versions.TOOL_NAME,
      '7.0.2'
    )
    expect(core.addPath).toHaveBeenCalledWith(`${fakeCachedPath}/bin`)
  })
})
