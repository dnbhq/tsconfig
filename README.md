# @dnbhq/tsconfig

Shared strict TypeScript configurations for DNBHQ projects.

- [Installation](#installation)
- [Available configs](#available-configs)
  - [Strict baseline](#strict-baseline)
  - [CLI apps](#cli-apps)
  - [Astro projects](#astro-projects)
- [Design notes](#design-notes)
- [Release](#release)
- [Usage in consuming projects](#usage-in-consuming-projects)
- [Notes](#notes)

## Installation

```bash
npm install --save-dev @dnbhq/tsconfig typescript
```

## Available configs

### Strict baseline

Use this for generic TypeScript projects.

```json
{
  "extends": "@dnbhq/tsconfig/strict",
  "include": [
    "src/**/*.ts"
  ]
}
```

### CLI apps

Use this for Node.js CLI tools and scripts.

```json
{
  "extends": "@dnbhq/tsconfig/cli",
  "include": [
    "src/**/*.ts",
    "scripts/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Astro projects

Use this for Astro projects using TypeScript.

```json
{
  "extends": "@dnbhq/tsconfig/astro",
  "include": [
    ".astro/types.d.ts",
    "**/*"
  ],
  "exclude": [
    "dist"
  ]
}
```

## Design notes

The package intentionally does not define `include`, `exclude`, or `files`.

Those settings belong to the consuming project because TypeScript overwrites them during inheritance instead of merging them.

The strict baseline also avoids environment-specific assumptions such as Node.js types, DOM types, JavaScript migration settings, or Astro-specific module resolution.

## Release

Dry run:

```bash
npm run release:dry
```

Release:

```bash
npm run release
```

Releases are handled by `release-it` and `@release-it/conventional-changelog`.

Commit messages should follow Conventional Commits.


## Usage in consuming projects

- Generic strict project:

  ```json
  {
    "extends": "@dnbhq/tsconfig/strict",
    "include": [
        "src/**/*.ts"
    ]
  }
  ```

* Node CLI project:

  ```json
  {
    "extends": "@dnbhq/tsconfig/cli",
    "include": [
        "src/**/*.ts",
        "scripts/**/*.ts"
    ]
  }
  ```

* Astro project:

  ```json
  {
    "extends": "@dnbhq/tsconfig/astro",
    "include": [
        ".astro/types.d.ts",
        "**/*"
    ]
  }
  ```

## Notes

* `include`, `exclude`, and `files` are project-local.TypeScript overwrites them from the consuming config, so the shared package should not define them. ([TypeScript][1])
* Multiple `extends` are supported since TypeScript 5.0+, but many tools still document or assume a single string. For maximum compatibility, only `astro.json` uses an array because it needs to compose Astro’s own strict config with your strict baseline. ([Microsoft for Developers][2])
* Defaults may not be obvious. Consumers see only their local `tsconfig.json`, not the full resolved config. Use `npx tsc --showConfig` in projects when debugging inherited values.
* `types` is intentionally not in `strict.json`. Setting `types` restricts which global `@types/*` packages are included, so Node types belong in `cli.json`, not the generic strict baseline. ([TypeScript][4])
* Astro config needs `astro` installed in the consuming project. `astro.json` extends `astro/tsconfigs/strict`, so that path must resolve from the project using the config.
* `erasableSyntaxOnly` requires a modern TypeScript version. Keep the peer dependency strict enough, otherwise older projects will fail on unknown compiler options.

[1]: https://www.typescriptlang.org/tsconfig/extends.html "TypeScript: TSConfig Option: extends"
[2]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/?utm_source=chatgpt.com "Announcing TypeScript 5.0"
[3]: https://github.com/release-it/conventional-changelog "GitHub - release-it/conventional-changelog: Conventional changelog plugin for release-it · GitHub"
[4]: https://www.typescriptlang.org/tsconfig/types?utm_source=chatgpt.com "TSConfig Option: types"
