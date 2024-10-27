#!/bin/bash

# Colors for logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to clean up directories
clean_directory() {
  local dir_type=$1
  local path_pattern=$2

  echo -e "${YELLOW}Searching for '$dir_type' directories ...${NC}"
  if find ./ -type d -name "$path_pattern" -exec rm -rf {} +; then
    # Removed the log for successful removal
    :
  else
    echo -e "${RED}Error removing '$dir_type' directories.${NC}"
  fi
}

# Clean .turbo directories
clean_directory ".turbo" ".turbo"

# Clean coverage directories
clean_directory "coverage" "coverage"

# Clean .nyc_output directories
clean_directory ".nyc_output" ".nyc_output"

# Final message
echo -e "${BOLD}${GREEN}Cleanup completed for all directories.${NC}"
