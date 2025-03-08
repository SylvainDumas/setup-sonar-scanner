# Setup SonarQube Scanner Action

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)
[![CodeQL](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/github-code-scanning/codeql)
[![GitHub Super-Linter](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/check-dist.yml/badge.svg)](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/check-dist.yml)

This action sets up the Scanner CLI for SonarQube (Server, Cloud) for use in
actions by:

- Optionally downloading and caching distribution of the requested scanner CLI
  version, and adding it to the PATH
- Registering problem matchers for error output.

You can find source code of the scanner CLI
[here](https://github.com/SonarSource/sonar-scanner-cli) and the available
[versions](https://github.com/SonarSource/sonar-scanner-cli/releases)

## Usage

Minimal

```yml
- uses: SylvainDumas/setup-sonar-scanner@v1
```

With version

```yml
- uses: SylvainDumas/setup-sonar-scanner@v1
  with:
    version: '7.0.2.4839'
```

## Inputs

### version

- **type**: string
- **required**: false
- **default**: `7.0.2.4839`
- **description**: version of the scanner to install. List of available
  versions: <https://github.com/SonarSource/sonar-scanner-cli/releases>.

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
  GitHub action to install and run an analysis on your code, but doesn't allow
  you to just install the Scanner CLI for SonarQube.
- <https://github.com/Warchant/setup-sonar-scanner> Another GitHub action to
  install the Scanner CLI for SonarQube, but no longer seems to be maintained.

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
