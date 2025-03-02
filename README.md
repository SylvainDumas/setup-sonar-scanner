# Setup Sonarqube Scanner Action

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)
[![CodeQL](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SylvainDumas/setup-sonar-scanner/actions/workflows/codeql-analysis.yml)
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

## Full Example usage

You can find additional informations in official Sonarqube
[documentation](https://docs.sonarsource.com/sonarqube-server/latest/devops-platform-integration/github-integration/adding-analysis-to-github-actions-workflow/).

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
        run:
          sonar-scanner -Dsonar.host.url=${{ secrets.SONAR_HOST_URL }}
          -Dsonar.token=${{ secrets.SONAR_TOKEN }} -Dsonar.organization=${{
          secrets.SONAR_ORGANIZATION }} -Dsonar.projectKey=${{
          secrets.SONAR_PROJECT_KEY }}
```

## Action Inputs

| input     | type   | default      | description                                                                                                               |
| --------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `version` | string | `7.0.2.4839` | version of the scanner to install. List of available versions: https://github.com/SonarSource/sonar-scanner-cli/releases. |

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)

## Contributions

Contributions are welcome! See [Contributor's Guide](docs/contributors.md)

## Code of Conduct

:wave: Be nice. See [our code of conduct](CODE_OF_CONDUCT.md)
