# Setup SonarQube Scanner Action

[![Conventional Branch](https://img.shields.io/badge/Conventional%20Branch-1.0.0-blue.svg)](https://conventional-branch.github.io)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)](https://semver.org/)

![CI](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/check-dist.yml/badge.svg)](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/check-dist.yml)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=SylvainDumas_setup-sonar-scanner&metric=coverage)](https://sonarcloud.io/summary/new_code?id=SylvainDumas_setup-sonar-scanner)
[![CodeQL](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/github-code-scanning/codeql)
[![GitHub Super-Linter](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)

This Action sets up the Scanner CLI for SonarQube (Server, Cloud) for use in
actions by:

- Optionally downloading and caching distribution of the requested Scanner CLI
  version, and adding it to the PATH
- Registering problem matchers for error output.

version can be the `latest`, an
[explicit](https://github.com/SonarSource/sonar-scanner-cli/releases) or a
[semantic version range](https://github.com/npm/node-semver?tab=readme-ov-file#versions)

You can find source code of the Scanner CLI
[here](https://github.com/SonarSource/sonar-scanner-cli)

## Requirements

- Node.js 20.19.0 or later (`>=20.19.0`).
- GitHub-hosted runners are supported and follow GitHub runtime evolution.

## Usage

Minimal (default use the latest version)

```yml
- uses: SylvainDumas/setup-sonar-scanner@v1
```

With an explicit
[version](https://github.com/SonarSource/sonar-scanner-cli/releases)

```yml
- uses: SylvainDumas/setup-sonar-scanner@v1
  with:
    version: '8.0.1.6346'
```

With a
[semantic version range](https://github.com/npm/node-semver?tab=readme-ov-file#versions)

```yml
- uses: SylvainDumas/setup-sonar-scanner@v1
  with:
    version: '8.x'
```

> [!TIP]
>
> You can use expression like `7.x` or more complex like `>=1.2.7 <1.3.0`,
> `1.2.7 || >=1.2.9 <2.0.0`, ...

## Inputs

### version

- **type**: string
- **required**: false
- **default**: `latest`
- **description**: version of the Scanner CLI to install.
  - latest
  - [explicit](https://github.com/SonarSource/sonar-scanner-cli/releases)
  - [semantic version range](https://github.com/npm/node-semver?tab=readme-ov-file#versions)

> [!WARNING]
>
> Minimum version supported: 3.x

## Full Example usage

You can find additional informations in official SonarQube
[documentation](https://docs.sonarsource.com/sonarqube-server/latest/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow/).

<!-- prettier-ignore-start -->

```yaml
name: SonarQube Workflow

on:
  push:
    branches:
      - main # the name of your main branch
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read

jobs:
  sonarqube-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      # Setup sonar-scanner
      - name: Setup SonarQube
        uses: SylvainDumas/setup-sonar-scanner@v1
      # Run sonar-scanner
      - name: SonarQube Scan
        run: sonar-scanner
          -Dsonar.host.url=${{ secrets.SONAR_HOST_URL }}
          -Dsonar.token=${{ secrets.SONAR_TOKEN }}
          -Dsonar.organization=$GITHUB_REPOSITORY_OWNER
          -Dsonar.projectKey=${{ secrets.SONAR_PROJECT_KEY }}
```

<!-- prettier-ignore-end -->

> [!NOTE]
>
> Need to be adapted following your use cases (GitHub workflow permissions, test
> coverage generation, ...)

## Other actions

- <https://github.com/SonarSource/sonarqube-scan-action> Official SonarQube
  GitHub Action to install and run an analysis on your code, but doesn't allow
  you to just install the Scanner CLI for SonarQube.
- <https://github.com/Warchant/setup-sonar-scanner> Another GitHub Action to
  install the Scanner CLI for SonarQube, but no longer seems to be maintained.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
