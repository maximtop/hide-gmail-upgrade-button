/**
 * @file Prepare the requested release PR with Release Please.
 */

import { GitHub, Manifest } from 'release-please';
import { ManifestPlugin } from 'release-please/build/src/plugin.js';

import type { CandidateReleasePullRequest } from 'release-please/build/src/manifest.js';

/**
 * Set the generated branch before Release Please looks for an existing PR.
 */
class VersionedBranch extends ManifestPlugin {
    /**
     * Give each candidate a branch based on its generated version.
     *
     * @param candidates Candidate PRs from the release strategy.
     */
    override run(candidates: CandidateReleasePullRequest[]): Promise<CandidateReleasePullRequest[]> {
        return Promise.resolve(candidates.map((candidate) => {
            const version = candidate.pullRequest.version?.toString();
            if (!version) {
                throw new Error('Release PR candidate has no version');
            }
            return {
                ...candidate,
                pullRequest: {
                    ...candidate.pullRequest,
                    headRefName: `release/${version}`,
                },
            };
        }));
    }
}

/**
 * Create or update the release PR for the validated version.
 *
 * @param github Release Please GitHub client.
 * @param branch Base branch for the PR.
 * @param version Requested release version.
 */
export async function prepareRelease(github: GitHub, branch: string, version: string): Promise<void> {
    const manifest = await Manifest.fromConfig(github, branch, {
        releaseType: 'node',
        releaseAs: version,
        includeComponentInTag: false,
        pullRequestHeader: 'Release notes',
    });
    manifest.plugins.push(new VersionedBranch(github, branch, manifest.repositoryConfig));
    await manifest.createPullRequests();
}

if (import.meta.main) {
    const { GH_TOKEN, GITHUB_REPOSITORY, RELEASE_VERSION } = process.env;
    const [owner, repo] = GITHUB_REPOSITORY?.split('/') ?? [];
    if (!owner || !repo || !GH_TOKEN || !RELEASE_VERSION) {
        throw new Error('GH_TOKEN, GITHUB_REPOSITORY, and RELEASE_VERSION are required');
    }

    const defaultBranch = 'master';
    const github = await GitHub.create({
        owner,
        repo,
        token: GH_TOKEN,
        defaultBranch,
    });
    await prepareRelease(github, defaultBranch, RELEASE_VERSION);
}
