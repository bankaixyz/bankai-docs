#!/usr/bin/env bash
set -euo pipefail

API_URL="https://sepolia.api.bankai.xyz/v1/openapi.json"
OUT="openapi.json"

curl -sS "$API_URL" \
  | python3 -c "
import json, sys
from collections import OrderedDict

spec = json.load(sys.stdin, object_pairs_hook=OrderedDict)

servers = [
    OrderedDict([('url', 'https://sepolia.api.bankai.xyz'), ('description', 'Sepolia')]),
    OrderedDict([('url', 'http://localhost:8080'), ('description', 'Local')]),
]

out = OrderedDict()
for key, val in spec.items():
    out[key] = val
    if key == 'info':
        out['servers'] = servers

json.dump(out, sys.stdout, indent=4)
" > "$OUT"

echo "openapi.json updated ($(wc -l < "$OUT" | tr -d ' ') lines)"
