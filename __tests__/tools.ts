import path from 'path'
import os from 'node:os'

export function prepareToolcacheDir() {
  if (!process.env['RUNNER_TOOL_CACHE']) {
    process.env['RUNNER_TOOL_CACHE'] = mkTempDir()
  }

  if (!process.env['RUNNER_TEMP']) {
    process.env['RUNNER_TEMP'] = mkTempDir()
  }
}

export function mkTempDir(): string {
  return path.join(os.tmpdir(), `${crypto.randomUUID()}`)
}
