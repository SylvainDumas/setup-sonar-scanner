import * as tc from '@actions/tool-cache'
import path from 'path'
import * as fs from 'fs'

/**
 * Represents version information for a specific component.
 */
export class Source {
  url!: string
  digest?: string
}

export class ToolInfo {
  source!: Source
  versionCache!: string
  binPath!: string
}

/**
 * Downloads the tool and caches it.
 *
 * @param source - The source information for the tool.
 * @returns The path to the downloaded tool.
 */
export async function downloadTool(source: Source): Promise<string> {
  // Download the tool
  const packagePath = await tc.downloadTool(source.url)

  // Verify checksum if provided (not implemented)

  // Extract the tool
  const extractorMethod = _getExtractorFn(source.url)
  let extractPath = await extractorMethod(packagePath)

  // If the package contains a single directory, return the path to it
  const packageContents = fs.readdirSync(extractPath)
  if (packageContents.length === 1) {
    const packageContentPath = path.join(extractPath, packageContents[0])
    if (fs.statSync(packageContentPath).isDirectory()) {
      extractPath = packageContentPath
    }
  }

  return extractPath
}

/**
 * Returns an appropriate extraction function based on the file extension of the given package file.
 *
 * @param packageFile - The name of the package file, including its extension.
 * @returns A function that takes a file and an optional destination, and returns a promise that resolves to a string.
 *
 * @throws Will throw an error if the file extension is unsupported.
 */
function _getExtractorFn(
  packageFile: string
): (file: string, dest?: string) => Promise<string> {
  // get file extension
  const fileExtension = packageFile.split('.').pop()?.toLowerCase()

  // return appropriate extraction function
  switch (fileExtension) {
    case 'zip':
      return tc.extractZip
    case '7z':
      return tc.extract7z
    case 'pkg':
      return tc.extractXar
    case 'tar.gz':
      return tc.extractTar
    default:
      throw new Error(
        `Unable to find extract function for file extension: ${fileExtension}`
      )
  }
}
