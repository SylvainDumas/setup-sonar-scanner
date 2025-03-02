import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import path from 'path'
import * as install from './install.js'
import * as versions from './versions.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version', { required: true })
    core.debug(`Version input: ${version}`)

    // Get the scanner CLI version from the requested version
    const cliVersion = versions.getCliVersion(version)
    core.info(
      `Find Scanner CLI version ${cliVersion} for requested version: ${version}`
    )

    // Find the tool in the cache or download it
    const ghCacheVersion = versions.getGhCacheVersion(cliVersion)
    let toolPath = tc.find(versions.TOOL_NAME, ghCacheVersion)
    core.debug(`Tool path: ${toolPath}`)
    core.info(
      `Search Scanner CLI version ${cliVersion} in local tool cache with version ${ghCacheVersion}: ${toolPath ? 'Found' : 'Not found'}`
    )
    if (!toolPath) {
      // Get version information
      const source = versions.getVersionSource(cliVersion)
      core.debug(`Source: ${source.url}`)
      core.info(`Scanner CLI version ${cliVersion}: Setup`)

      const extractedPath = await install.downloadTool(source)
      core.debug(`Extracted path: ${extractedPath}`)
      toolPath = await tc.cacheDir(
        extractedPath,
        versions.TOOL_NAME,
        ghCacheVersion
      )
      core.debug(`Cached path: ${toolPath}`)
    }

    // Add the tool to path
    const binPath = path.join(toolPath, 'bin')
    core.info(`Scanner CLI version ${cliVersion}: Adding to PATH`)
    core.debug(`Adding ${binPath} to PATH`)
    core.addPath(binPath)
  } catch (err) {
    // setFailed logs the message and sets a failing exit code
    core.setFailed(`Action failed with error ${err}`)
  }
}
