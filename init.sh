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

  # 從函式輸入參數 $1 (通常是整段 HTML) 中
  # 用 sed 抓取 Constraints 區塊的起點 <p><strong>Constraints:</strong></p> 到結尾 </ul> 的所有行
  raw=$(echo "$1" | sed -n '/<p><strong>Constraints:<\/strong><\/p>/,/<\/ul>/p')

  constraints=$(
    echo "$raw" |
      grep '<li>' | # 過濾出含有 <li> 標籤的行 (li 為 list item)

      # 移除 <li><code> 和 </code></li>，這兩個一起出現的標籤組合
      sed -E 's|<li><code>||g; s|</code></li>||g' |

      # 移除剩餘的 <li> 和 </li> 標籤
      sed -E 's|<li>||g; s|</li>||g' |

      # 移除 <code> 和 </code> 標籤
      sed -E 's|<code>||g; s|</code>||g' |

      # 把 <sup>...</sup> 中的內容抓出來，用 \1 表示（即括號內匹配的內容）
      # 例如：<sup>5</sup> 會被替換成 ^5
      sed -E 's|<sup>([^<]*)</sup>|^\1|g' |

      # 把 HTML 中的 escape code 轉回原始符號：
      # &lt; 轉成 <
      # &gt; 轉成 >
      # &amp; 轉成 &
      sed 's/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g' |

      # 將前面變成 ^數字 的格式，再用 **數字 表示次方
      # 例如：^5 變成 **5 (程式語言指數符號)
      sed -E 's/\^([0-9]+)/**\1/g' |

      # 移除每行開頭多餘空白，避免後續對齊錯誤
      sed 's/^[[:space:]]*//'
  )

  if [[ -z "$constraints" ]]; then
    echo " *    (Constraints not found)"
    return
  fi

  # 用 awk 處理每一行，並輸出帶有編號和格式的文字
  echo "$constraints" | awk '{
    # NR 是 awk 內建變數，代表當前處理的行號（從 1 開始計數）
    # $0 代表當前整行的內容（也就是 constraint 文字本體）

    # printf 用來格式化輸出：
    # " *    " 是前綴固定空白和星號
    # %d 是輸出 NR（行號），並且是整數格式
    # ". " 是數字後面固定的句點和一個空白
    # %s 是輸出整行文字（$0）
    printf " *    %d. %s\n", NR, $0
  }'
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

file_content=$(
  cat <<EOF
/**
 * Status:
 *    - [ ] Done
 *    - [ ] Follow-up solutions
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
)

if [[ "${1:-}" == '--dry-run' || "${1:-}" == '--dryrun' ]]; then
  echo "==== 檔案內容預覽 ===="
  echo "$file_content"
  echo "====   預覽結束   ===="
else

  mkdir -p "$(dirname "$FILE_PATH")"
  echo "$file_content" >"$FILE_PATH"
  echo "File '$FILE_PATH' created successfully."
fi
