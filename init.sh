#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "Error: No filename provided. Usage: ./script.sh <filename>"
  exit 1
fi

FILE_PATH="leetcodes/$1.js"

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
 * Topics:
 *
 * Statements:
 *
 * Constraints:
 **/
EOF

echo "File '$FILE_PATH' created successfully."
