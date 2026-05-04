// `@actions/core` v3+ is ESM-only, so it must be loaded via dynamic import to
// remain consumable from this CommonJS bundle (and from Jest).
const loadCore = async (): Promise<typeof import('@actions/core')> =>
  await import('@actions/core')

export const getVersionInput = async (): Promise<string> => {
  const core = await loadCore()
  return core.getInput('version')
}

export const getGithubTokenInput = async (): Promise<string> => {
  const core = await loadCore()
  return core.getInput('github-token')
}
