// @vitest-environment node

/**
 * @file Exercise release PR preparation with Release Please and fixture GitHub responses.
 */

import { expect, it, vi } from 'vitest';

import { prepareRelease } from '../../scripts/release/prepare';

import type { Commit, GitHub, PullRequest } from 'release-please';

async function* iterate<T>(items: T[]): AsyncGenerator<T> {
    yield* items;
}

it('creates a versioned PR with linked notes and reuses it when the same version is prepared again', async () => {
    const branch = 'master';
    const currentVersion = '0.4.1';
    const releaseVersion = '0.4.2';
    const repository = { owner: 'example', repo: 'extension', defaultBranch: branch };
    const released = {
        sha: '0000000000000000000000000000000000000001',
        message: 'chore(master): release 0.4.1',
        files: ['package.json', 'CHANGELOG.md'],
    };
    const latestRelease = {
        ...released,
        pullRequest: {
            number: 41,
            title: released.message,
            body: '',
            baseBranchName: branch,
            headBranchName: `release/${currentVersion}`,
            mergeCommitOid: released.sha,
            labels: ['autorelease: tagged'],
            files: released.files,
        },
    };
    const fix = {
        sha: '0000000000000000000000000000000000000002',
        message: 'fix: keep the settings available',
        files: ['src/settings.ts'],
    };
    const commits: Commit[] = [fix, latestRelease];
    const open: PullRequest[] = [];
    const createPullRequest = vi.fn<GitHub['createPullRequest']>(async (candidate) => {
        const pr = { ...candidate, number: 42 };
        open.push(pr);
        return pr;
    });
    const updatePullRequest = vi.fn<GitHub['updatePullRequest']>(async (number, candidate) => {
        const index = open.findIndex((pr) => pr.number === number);
        const updated = { ...open[index]!, body: candidate.body.toString() };
        open[index] = updated;
        return updated;
    });
    const github = {
        repository,
        getFileContentsOnBranch: () => Promise.resolve({
            parsedContent: JSON.stringify({ name: repository.repo, version: currentVersion }),
        }),
        mergeCommitIterator: () => iterate(commits),
        pullRequestIterator: (_branch: string, status: string) => iterate(status === 'OPEN' ? open : []),
        releaseIterator: () => iterate([{
            id: 1,
            tagName: `v${currentVersion}`,
            sha: released.sha,
            url: `https://github.com/example/extension/releases/tag/v${currentVersion}`,
        }]),
        createPullRequest,
        updatePullRequest,
    } as unknown as GitHub;

    await prepareRelease(github, branch, releaseVersion);

    expect(open).toHaveLength(1);
    expect(open[0]).toMatchObject({
        headBranchName: 'release/0.4.2',
        baseBranchName: branch,
        labels: ['autorelease: pending'],
    });
    const firstBody = open[0]?.body;
    expect(firstBody).toMatch(/^Release notes\n---\n/);
    expect(firstBody).toContain('[0.4.2](https://github.com/example/extension/compare/v0.4.1...v0.4.2)');
    expect(firstBody).toContain(`https://github.com/example/extension/commit/${fix.sha}`);
    expect(firstBody).toContain('[Release Please](https://github.com/googleapis/release-please)');
    expect(createPullRequest.mock.calls[0]?.[3].map((update) => update.path)).toEqual(
        expect.arrayContaining(['package.json', 'CHANGELOG.md']),
    );

    await prepareRelease(github, branch, releaseVersion);
    expect(updatePullRequest).not.toHaveBeenCalled();

    commits.unshift({ ...fix, sha: '0000000000000000000000000000000000000003', message: 'fix: show the toggle' });
    await prepareRelease(github, branch, releaseVersion);

    expect(createPullRequest).toHaveBeenCalledTimes(1);
    expect(updatePullRequest).toHaveBeenCalledTimes(1);
    expect(updatePullRequest.mock.calls[0]?.[0]).toBe(42);
    expect(open[0]?.body).toContain('show the toggle');
});
