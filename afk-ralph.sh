#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  tmpfile=$(mktemp)

  codex exec \
    --full-auto \
    --output-last-message "$tmpfile" \
    "PRD.md progress.md

1. Read PRD.md and progress.md.
2. Find the highest-priority incomplete task and implement it.
3. Run relevant tests and type checks.
4. Update progress.md with exactly what you completed.
5. Update PRD.md to put a checkbox next to the task item you have implemented.

ONLY WORK ON A SINGLE TASK.
If the PRD is complete, output exactly: <promise>COMPLETE</promise>."

  result=$(cat "$tmpfile")
  rm -f "$tmpfile"

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete after $i iterations."
    exit 0
  fi
done