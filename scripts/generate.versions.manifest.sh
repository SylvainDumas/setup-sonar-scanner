#!/bin/bash
set -euo pipefail

# Fetch tags from the GitHub repository
tags=$(curl -s https://api.github.com/repos/SonarSource/sonar-scanner-cli/tags | jq -r '.[].name')

# Sort tags
sorted_tags=$(echo "$tags" | sort -rV)

# Convert sorted tags to JSON array
json_array=$(echo "$sorted_tags" | jq -R . | jq -s .)

# Check if the JSON array is empty
if [ "$json_array" == "[]" ]; then
  echo "Error: JSON array is empty"
  exit 1
fi

# Replace " with ' in the JSON array
json_array=${json_array//\"/\'}

# Save JSON array to versi.ts file
echo "export const CLI_VERSIONS = $json_array" > src/versions.manifest.ts
echo "" >> src/versions.manifest.ts
echo "export const CLI_VERSION_LATEST = CLI_VERSIONS[0]" >> src/versions.manifest.ts
