import { setupShfmt } from './shfmt'

// `@actions/core` v3+ is ESM-only, so it must be loaded via dynamic import to
// remain consumable from this CommonJS bundle (and from Jest).
const loadCore = async (): Promise<typeof import('@actions/core')> =>
  await import('@actions/core')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await setupShfmt()
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      const core = await loadCore()
      core.setFailed(error.message)
    }
  }
}
