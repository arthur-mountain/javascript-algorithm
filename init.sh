#!/usr/bin/env bash

set -euo pipefail

# 讀取題號
read -rp "Enter the question number: " question_number
if [ -z "$question_number" ]; then
  echo "❌ Error: Question Number is required."
  exit 1
fi

# 讀取子目錄（可選）
read -rp "Enter the topic folder (optional): " topic

# 設定檔案路徑
if [ -n "$topic" ]; then
  FILE_PATH="leetcodes/$topic/$question_number.js"
else
  FILE_PATH="leetcodes/$question_number.js"
fi

# 檢查檔案是否存在
if [ -f "$FILE_PATH" ]; then
  echo "❌ Error: File '$FILE_PATH' already exists."
  exit 1
fi

echo "🔍 Fetching question metadata from LeetCode..."

# HTML 實體解碼小函式（簡單版）
decode_html_entities() {
  sed 's/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g; s/&quot;/"/g; s/&#39;/'"'"'/g'
}

get_title_slug() {
  local qnum="$1"
  http --ignore-stdin --body GET https://leetcode.com/api/problems/all/ |
    jq -r --arg qid "$qnum" '
      .stat_status_pairs[]
      | select(.stat.frontend_question_id == ($qid | tonumber))
      | .stat.question__title_slug' | head -n1
}

get_question_data() {
  http --ignore-stdin --body POST https://leetcode.com/graphql \
    Origin:https://leetcode.com \
    Referer:https://leetcode.com/problems/"$1"/ \
    User-Agent:'Mozilla/5.0' \
    Content-Type:application/json \
    query='query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        content
        topicTags { name }
      }
    }' \
    variables:="{\"titleSlug\":\"$1\"}"
}

extract_constraints() {
  local raw constraints
  raw=$(echo "$1" | sed -n '/<p><strong>Constraints:<\/strong><\/p>/,/<\/ul>/p')

  constraints=$(echo "$raw" |
    grep '<li>' |
    sed -E 's|<li><code>||g; s|</code></li>||g' |
    sed -E 's|<li>||g; s|</li>||g' |
    sed -E 's|<code>||g; s|</code>||g' |
    sed -E 's|<sup>([^<]*)</sup>|^\1|g' |
    sed 's/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g' |
    sed -E 's/\^([0-9]+)/**\1/g')

  if [[ -z "$constraints" ]]; then
    echo " *    (Constraints not found)"
    return
  fi

  echo "$constraints" | awk '{printf " *    %d. %s\n", NR, $0}'
}

titleSlug=$(get_title_slug "$question_number")
if [[ -z "$titleSlug" ]]; then
  echo "❌ Cannot find slug for question number $question_number"
  exit 1
fi

response=$(get_question_data "$titleSlug")

title=$(echo "$response" | jq -r '.data.question.title // empty')
topics=$(echo "$response" | jq -r '.data.question.topicTags[].name' | awk '{print " *    " NR ". " $0}')
constraints=$(extract_constraints "$(echo "$response" | jq -r '.data.question.content // empty')")

echo "==== 下面是檔案內容預覽 ===="
cat <<EOF
/**
 * Status:
 *  - [ ] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *    $question_number. $title
 *
 * Topics:
$topics
 *
 * Statements:
 *    (Add problem statements here)
 *
 * Constraints:
$constraints
 **/
EOF
echo "==== 預覽結束 ===="

exit 0

# 創建檔案並插入模板內容
mkdir -p "$(dirname "$FILE_PATH")"

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
 *
 *
 * Statements:
 *
 *
 *
 * Constraints:
 *
 **/
EOF

echo "File '$FILE_PATH' created successfully."
