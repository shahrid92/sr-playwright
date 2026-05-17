#!/bin/bash

# 1. Get total tests
GET_TOTAL_TESTS=$(npx playwright test --grep @smoke --list --config '../../../playwright.config.ts' --project='chromium')

WORKERS=4

# 2. Extract total test
TOTAL_TESTS=$(echo $GET_TOTAL_TESTS | grep -Eo 'Total: [0-9]+' | grep -Eo '[0-9]+')

SHARDS=$(( ($TOTAL_TESTS + $WORKERS - 1) / $WORKERS ))

echo "Total Tests Discovered: $SHARDS"

