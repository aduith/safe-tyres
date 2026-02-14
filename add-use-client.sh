#!/bin/bash

# Script to add 'use client' directive to all page.tsx files in app directory

for file in app/*/page.tsx app/*/*/page.tsx; do
  if [ -f "$file" ]; then
    # Check if file doesn't already have 'use client'
    if ! grep -q "'use client'" "$file"; then
      # Add 'use client' at the beginning
      echo "'use client';
" | cat - "$file" > temp && mv temp "$file"
      echo "Added 'use client' to $file"
    fi
  fi
done
