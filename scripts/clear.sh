#!/bin/bash

function clear {
	remove_files "node_modules"
	remove_files ".turbo"
	remove_files "yarn-error.log"
}

function remove_files {
    echo "Remove files for $1"
    find . -type d -name "$1" -exec rm -rf {} +
    find . -type f -name "$1" -exec rm {} +
}

clear
