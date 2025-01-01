#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "Error: No filename provided. Usage: ./init.sh <filename>"
  exit 1
fi

# File name
FILE_PATH="$1.js"

# Add Topic folder to file path if exists
if [ -n "$2" ]; then
  FILE_PATH="$2/$FILE_PATH"
fi

FILE_PATH="leetcodes/${FILE_PATH}"

if [ -f "$FILE_PATH" ]; then
  echo "Error: File '$FILE_PATH' already exists."
  exit 1
fi

# 創建檔案並插入模板內容
cat >"$FILE_PATH" <<-EOF
/**
 * Status:
 *  - [ ] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *
 *
 * Topics:
 *
 *
 *
 * Statements:
 *
 *
 *
 * Constraints:
 *
 *
 *
 **/
EOF

echo "File '$FILE_PATH' created successfully."
