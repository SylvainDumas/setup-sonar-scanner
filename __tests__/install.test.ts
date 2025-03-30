import * as install from '../src/install'
import fs from 'fs'
import path from 'path'
import io from '@actions/io'
import nock from 'nock'
import os from 'node:os'

const tempPath = mkTempDir()
const cachePath = mkTempDir()
process.env['RUNNER_TOOL_CACHE'] = cachePath
process.env['RUNNER_TEMP'] = tempPath
const testdataPath = path.join(process.cwd(), '__tests__', 'testdata')

const IS_WINDOWS = process.platform === 'win32'
//const IS_MAC = process.platform === 'darwin'

function mkTempDir(): string {
  return path.join(os.tmpdir(), `${crypto.randomUUID()}`)
}

describe('downloadTool', () => {
  beforeEach(async () => {
    await io.mkdirP(cachePath)
    await io.mkdirP(tempPath)
  })

  afterEach(async () => {
    await io.rmRF(tempPath)
    await io.rmRF(cachePath)
    nock.cleanAll()
  })

  for (const extension of ['zip', '7z', 'tar.gz']) {
    if (extension === '7z' && !IS_WINDOWS) continue

    it(`${extension}: should download & extract the tool and change to directory bin`, async () => {
      const result = await install.downloadTool(mockSource('bin', extension))

      expect(result.startsWith(tempPath)).toBe(true)
      expect(result.endsWith('bin')).toBe(true)
      expect(fs.existsSync(result)).toBe(true)
      expect(fs.readdirSync(result)).toEqual([`${extension}.txt`])
    })
  }

  it('should throw an error for unsupported file extension', async () => {
    const unsupportedSource: install.Source = mockSource('tool', 'unsupported')
    await expect(install.downloadTool(unsupportedSource)).rejects.toThrow(
      'Unable to find extract function for file: tool.unsupported'
    )
  })
})

function mockSource(file: string, extension: string): install.Source {
  const testUrl = 'http://example.com'
  const filename = `${file}.${extension}`
  const mockSource: install.Source = {
    url: `${testUrl}/${filename}`,
    digest: 'some-digest'
  }
  nock(testUrl)
    .get(`/${filename}`)
    .replyWithFile(200, path.join(testdataPath, filename))

  return mockSource
}
