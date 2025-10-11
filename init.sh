#!/usr/bin/env bash

set -euo pipefail

# 讀取題號
question_number="${1:-}"
if [ -z "$question_number" ]; then
  read -rp "Enter the question number: " question_number
fi
if [ -z "$question_number" ]; then
  echo "❌ Error: Question Number is required."
  exit 1
fi

# 讀取子目錄（可選）
read -rp "Enter the topic folder (optional): " topic

# 設定目錄路徑
if [ -n "$topic" ]; then
  DIR_PATH="leetcodes/$topic/$question_number"
else
  DIR_PATH="leetcodes/$question_number"
fi

# 檢查目錄是否存在
if [ -d "$DIR_PATH" ]; then
  echo "❌ Error: Directory '$DIR_PATH' already exists."
  exit 1
fi

echo "🔍 Fetching question metadata from LeetCode..."

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
    Referer:https://leetcode.com/problems/"$1" \
    Content-Type:application/json \
    query="query questionData(\$titleSlug: String!) {
      question(titleSlug: \$titleSlug) {
        title
        difficulty
        content
        topicTags { name }
        codeSnippets { langSlug code }
      }
    }" \
    variables:="{\"titleSlug\":\"$1\"}" # 傳遞變數給 GraphQL 查詢，將 $1（題目 slug）放入變數 titleSlug 裡
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
    echo ""
    return
  fi

  # 用 awk 處理每一行，並輸出帶有格式的 Markdown 列表
  echo "$constraints" | awk '{
    # NR 是 awk 內建變數，代表當前處理的行號（從 1 開始計數）
    # $0 代表當前整行的內容（也就是 constraint 文字本體）

    # printf 用來格式化輸出為 Markdown 列表格式
    printf "- %s\n", $0
  }'
}

titleSlug=$(get_title_slug "$question_number")
if [[ -z "$titleSlug" ]]; then
  echo "❌ Cannot find slug for question number $question_number"
  exit 1
fi

response=$(get_question_data "$titleSlug")

title=$(echo "$response" | jq -r '.data.question.title // empty')
difficulty=$(echo "$response" | jq -r '.data.question.difficulty // empty')
topics=$(echo "$response" | jq -r '.data.question.topicTags[].name' | awk '{printf "  - %s\n", $0}')
constraints=$(extract_constraints "$(echo "$response" | jq -r '.data.question.content // empty')")
code_snippet=$(echo "$response" | jq -r '.data.question.codeSnippets[] | select(.langSlug == "javascript") | .code')

# 獲取當前日期
current_date="$(date +%Y-%m-%d)"

# 生成 README.md 內容
readme_content=$(
  cat <<EOF
---
title: "$question_number. $title"
tags:
$topics
difficulty: "$difficulty"
date_solved: ""
link: "https://leetcode.com/problems/$titleSlug/description/"
---

## 問題描述



## Constraints

$constraints

## 解題思路

### 初步分析
- 關鍵觀察：
- 適用 Pattern：
- 可能的陷阱：

## 解法總覽

### Solution1：

- **思路說明**：


- **複雜度分析**：
  - 時間複雜度：O()
  - 空間複雜度：O()
  - 通過狀態：⬜️ AC / ❌ TLE / ❌ MLE / ❌ WA


- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：


- **測試案例**：

  - 案例 A:

  ---

## 學習記錄

- 首次解題：$current_date | 耗時：分鐘 | 獨立完成：□ 是 □ 否
- 複習 1：____ | 順暢度：□ 流暢 □ 卡頓 □ 忘記
EOF
)

# 預覽模式
if [[ "${2:-}" == '--dry-run' || "${2:-}" == '--dryrun' ]]; then
  # 定義顏色
  BOLD_PURPLE='\033[1;35m'
  RESET='\033[0m'
  echo -e "${BOLD_PURPLE}==== 目錄結構預覽 ====${RESET}"
  echo "Directory: $DIR_PATH"
  echo "  ├── README.md"
  echo "  └── solution1.js"
  echo ""
  echo -e "${BOLD_PURPLE}==== README.md 內容預覽 ====${RESET}"
  echo "$readme_content"
  echo ""
  echo -e "${BOLD_PURPLE}==== code snippet 內容預覽 ====${RESET}"
  echo "$code_snippet"
  echo ""
  echo -e "${BOLD_PURPLE}====   預覽結束   ====${RESET}"
else
  # 建立目錄結構
  mkdir -p "$DIR_PATH"

  # 寫入 README.md
  echo "$readme_content" >"$DIR_PATH/README.md"

  # 寫入 solution1.js
  echo "$code_snippet" >"$DIR_PATH/solution1.js"

  echo "✅ Directory '$DIR_PATH' created successfully."
  echo "   ├── README.md"
  echo "   └── solution1.js"

  # 是否要直接開啟
  read -rp "Open README.md directly? (y/n): " answer
  answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
  if [[ "$answer" == 'y' ]]; then
    "$EDITOR" "$DIR_PATH/README.md"
  fi
fi
