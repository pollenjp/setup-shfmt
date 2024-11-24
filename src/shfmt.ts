import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import { versionInput } from './inputs'
import { CMD_NAME, OWNER, REPO, TOOL_CACHE_NAME } from './constants'
import { exec } from 'child_process'
export const setupShfmt = async (): Promise<void> => {
  const version = await getVersion(versionInput)

  let toolPath = findVersionInHostedToolCacheDirectory(version)
  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`)
  } else {
    const fileName = `${TOOL_CACHE_NAME}_v${version}_${translateOsPlatformToDistPlatformName()}_${translateArchToDistArchName()}`
    const downloadPath = await tc.downloadTool(
      `${getDownloadBaseUrl(version)}/${fileName}${translateOsPlatformToDistPlatformName() === 'windows' ? '.exe' : ''}`
    )
    toolPath = await tc.cacheFile(
      downloadPath,
      CMD_NAME,
      TOOL_CACHE_NAME,
      version
    )
    core.info(`Downloaded to ${toolPath}`)
  }

  // Add file permission to toolPath/CMD_NAME
  exec(`chmod +x "${toolPath}/${CMD_NAME}"`)

  core.addPath(toolPath)
}

interface ReleaseResponse {
  tag_name: string
}

/**
 * Get the version of shfmt to download
 * @param version 'latest' or 'x.y.z'
 * @returns 'x.y.z'
 */
const getVersion = async (version: string): Promise<string> => {
  switch (version) {
    case 'latest': {
      // curl -s https://api.github.com/repos/mvdan/sh/releases/latest | jq -r '.tag_name'
      const response = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`
      )
      const releaseResponse: ReleaseResponse =
        (await response.json()) as ReleaseResponse
      const tagName: string = releaseResponse.tag_name
      if (typeof tagName !== 'string') {
        throw new Error('Failed to get the latest version of shfmt.')
      }
      return tagName.replace(/^v/, '')
    }
    default:
      return version
  }
}

export const getDownloadBaseUrl = (version: string): URL => {
  switch (version) {
    case 'latest':
      return new URL('https://github.com/mvdan/sh/releases/latest/download')
    default:
      return new URL(
        `https://github.com/mvdan/sh/releases/download/v${version}`
      )
  }
}

const findVersionInHostedToolCacheDirectory = (version: string): string => {
  return tc.find(TOOL_CACHE_NAME, version, translateArchToDistArchName())
}

const translateOsPlatformToDistPlatformName = (): string => {
  switch (os.platform()) {
    case 'win32':
      return 'windows'
    case 'darwin':
      return 'darwin'
    case 'linux':
      return 'linux'
    default:
      throw new Error(`Unsupported platform: ${os.platform()}.`)
  }
}

/**
 *
 * os.arch(): 'arm', 'arm64', 'ia32', 'loong64', 'mips', 'mipsel', 'ppc', 'ppc64', 'riscv64', 's390', 's390x', and 'x64'
 * ->
 * shfmt_v3.10.0_darwin_amd64
 * shfmt_v3.10.0_darwin_arm64
 * shfmt_v3.10.0_linux_386
 * shfmt_v3.10.0_linux_amd64
 * shfmt_v3.10.0_linux_arm
 * shfmt_v3.10.0_linux_arm64
 * shfmt_v3.10.0_windows_386.exe
 * shfmt_v3.10.0_windows_amd64.exe
 *
 * @param arch
 * @returns
 */
const translateArchToDistArchName = (): string => {
  switch (os.arch()) {
    case 'x64':
      return 'amd64'
    case 'arm64':
      return 'arm64'
    case 'arm':
      return 'arm'
    case 'ia32':
      return '386'
    default:
      throw new Error(
        `Unsupported architecture: ${os.arch()}. Use go install instead.`
      )
  }
}
