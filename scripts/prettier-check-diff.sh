#!/bin/sh
# Check Prettier formatting and show diffs for files that fail

files=$(pnpm prettier --list-different . 2>/dev/null)

if [ -n "$files" ]; then
    echo "Prettier found formatting issues. Showing diffs:"
    echo ""
    echo "$files" | while IFS= read -r file; do
        echo "=== $file ==="
        # Format the file to a temp location and diff
        pnpm prettier "$file" > /tmp/prettier-formatted.tmp
        diff -u "$file" /tmp/prettier-formatted.tmp || true
        rm -f /tmp/prettier-formatted.tmp
        echo ""
    done
    exit 1
else
    pnpm prettier --check .
fi

