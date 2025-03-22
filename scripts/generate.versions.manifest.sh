#!/bin/bash
set -euo pipefail

# Function to fetch tags from the GitHub repository with pagination
fetch_tags() {
  local page=1
  local tags=()

  while :; do
    response=$(curl -s "https://api.github.com/repos/SonarSource/sonar-scanner-cli/tags?page=$page&per_page=100")
    page_tags=$(echo "$response" | jq -r '.[].name')

    if [ -z "$page_tags" ]; then
      break
    fi

    tags+=("$page_tags")
    ((page++))
  done

  echo "${tags[@]}"
}

# Fetch all tags
fetched_tags=$(fetch_tags)

# Filter tags to keep only versions 3.x.x and above
filtered_tags=$(echo "$fetched_tags" | tr ' ' '\n' | grep -E '^[3-9]|^[1-9][0-9]')

# Sort tags
sorted_tags=$(echo "$filtered_tags" | tr ' ' '\n' | sort -rV)

# Convert sorted tags to JSON array
json_array=$(echo "$sorted_tags" | jq -R . | jq -s .)

# Check if the JSON array is empty
if [ "$json_array" == "[]" ]; then
  echo "Error: JSON array is empty"
  exit 1
fi

# Replace " with ' in the JSON array
json_array=${json_array//\"/\'}

# Save JSON array to versions.manifest.ts file
echo "export const CLI_VERSIONS = $json_array" >src/versions.manifest.ts
echo "" >>src/versions.manifest.ts
echo "export const CLI_VERSION_LATEST = CLI_VERSIONS[0]" >>src/versions.manifest.ts