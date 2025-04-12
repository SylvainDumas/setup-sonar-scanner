import type * as install from '../src/install'
import { jest } from '@jest/globals'

export const downloadTool = jest.fn<typeof install.downloadTool>()
