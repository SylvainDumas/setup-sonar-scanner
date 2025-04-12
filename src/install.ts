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

/**
 * Downloads a tool from the specified source URL, extracts it, and returns the path to the extracted content.
 * If the extracted content contains a single directory, the path to that directory is returned.
 *
 * @param source - An object containing the URL of the tool to download.
 * @returns A promise that resolves to the path of the extracted tool.
 *
 * @throws Will throw an error if the download or extraction process fails.
 */
export async function downloadTool(source: Source): Promise<string> {
  // Download the tool
  const packagePath = await tc.downloadTool(source.url)

  // Verify checksum if provided (not implemented)

  // Extract the tool
  const extractorMethod = _getExtractorFn(source.url)
  let extractPath = await extractorMethod(packagePath)

  // If the package contains a single directory, return the path to it
  const packageContents: string[] = fs.readdirSync(extractPath)
  if (packageContents.length === 1) {
    const packageContentPath = path.join(extractPath, packageContents[0])
    if (fs.statSync(packageContentPath).isDirectory()) {
      extractPath = packageContentPath
    }
  }

  return extractPath
}

type ExtractorFn = (file: string, dest?: string) => Promise<string>

/**
 * Returns an appropriate extraction function based on the file extension of the given package file.
 *
 * @param packageFile - The name of the package file, including its extension.
 * @returns A function that takes a file and an optional destination, and returns a promise that resolves to a string.
 *
 * @throws Will throw an error if the file extension is unsupported.
 */
function _getExtractorFn(packageFile: string): ExtractorFn {
  // Map of known file extensions to extraction functions
  const extensionMap: { [key: string]: ExtractorFn } = {
    '.zip': tc.extractZip,
    '.7z': tc.extract7z,
    '.pkg': tc.extractXar,
    '.tar.gz': tc.extractTar
  }

  // Determine the file extension
  const filename = path.basename(packageFile)
  for (const [extension, extractor] of Object.entries(extensionMap)) {
    if (filename.endsWith(extension)) return extractor
  }

  // If the file extension is not recognized, throw an error
  throw new Error(`Unable to find extract function for file: ${filename}`)
}
