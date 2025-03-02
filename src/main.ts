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

    if (!versions.isSonarVersion(version)) {
      throw new Error(`Unsupported version format: ${version}`)
    }

    // get the cache version (explicit semantic version)
    const cacheVersion = versions.toExplicitVersion(version)
    core.info(
      `SonarQube scanner CLI version ${version}: Cache version ${cacheVersion}`
    )

    // Find the tool in the cache or download it
    let toolPath = tc.find(versions.TOOL_NAME, cacheVersion)
    if (!toolPath) {
      // Get version information
      const source = versions.getVersionSource(version)
      core.info(`SonarQube scanner CLI version ${version}: Setup`)

      core.info(
        `SonarQube scanner CLI version ${version}: Not in cache, downloading`
      )
      const extractedPath = await install.downloadTool(source)
      core.debug(`Extracted path: ${extractedPath}`)
      toolPath = await tc.cacheDir(
        extractedPath,
        versions.TOOL_NAME,
        cacheVersion
      )
      core.debug(`Cached path: ${toolPath}`)
    } else {
      core.info(`SonarQube scanner CLI version ${version}: Found in cache`)
    }

    // Add the tool to path
    const binPath = path.join(toolPath, 'bin')
    core.info(`SonarQube scanner CLI version ${version}: Adding to PATH`)
    core.debug(`Adding ${binPath} to PATH`)
    core.addPath(binPath)
  } catch (err) {
    // setFailed logs the message and sets a failing exit code
    core.setFailed(`Action failed with error ${err}`)
  }
}
