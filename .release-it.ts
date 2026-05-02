import type { Config } from 'release-it';

const config = {
  npm: {
    publish: false,
  },
  git: {
    requireCleanWorkingDir: true,
    commit: true,
    commitMessage: 'chore(release): v${version}',
    commitArgs: ['--no-verify'],
    tag: true,
    tagName: 'v${version}',
    push: true,
    pushArgs: ['--follow-tags'],
    requireBranch: "main"
  },
  github: {
    release: true,
    releaseName: 'v${version}',
    tokenRef: 'GITHUB_DNBHQ_TOKEN_ADMIN_PRIVATE',
    skipChecks: true,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      header: "# Changelog",
      preset: {
        name: 'conventionalcommits',
        commitUrlFormat:
          'https://github.com/davidsneighbour/kollitsch.dev/commit/{{hash}}',
        compareUrlFormat:
          'https://github.com/davidsneighbour/kollitsch.dev/compare/{{previousTag}}...{{currentTag}}',
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'chore', section: 'Chores' },
          { type: 'build', section: 'Build' },
          { type: 'ci', section: 'CI' },
          { type: 'docs', section: 'Documentation' },
          { type: 'perf', section: 'Performance' },
          { type: 'refactor', section: 'Refactoring', hidden: true },
          { type: 'revert', section: 'Reverts' },
          { type: 'style', section: 'Styles' },
          { type: 'test', section: 'Tests' },
        ],
      },
      whatBump(commits: Array<{ type?: string; notes?: unknown[] }>) {
        let level: 2 | 1 | 0 | null = null;

        for (const commit of commits) {
          const notes = Array.isArray(commit.notes) ? commit.notes : [];
          const type = typeof commit.type === 'string' ? commit.type : '';

          if (notes.length > 0) {
            return {
              level: 0,
              reason: 'There are BREAKING CHANGES.',
            };
          }

          if (type === 'feat' || type === 'content') {
            level = 1;
            continue;
          }

          if (
            level === null &&
            ['fix', 'build', 'chore', 'ci', 'docs', 'perf', 'refactor', 'revert', 'style', 'test'].includes(type)
          ) {
            level = 2;
          }
        }

        if (level === null) {
          return false;
        }

        return {
          level,
          reason:
            level === 1
              ? 'There are feat/content commits.'
              : 'There are patch-level changes.',
        };
      },
    },
  },
} satisfies Config;

export default config;
