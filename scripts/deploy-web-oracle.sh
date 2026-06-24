#!/usr/bin/env bash
#
# Build the Expo web export and deploy it to the Oracle VM, where Caddy serves it
# (app.yourdomain.com) alongside the two APIs (wiktapi.dev :3000, word-bank-server
# :4000). See web.md → "6a. Self-host on the Oracle VM".
#
# The two EXPO_PUBLIC_* URLs are inlined into the bundle at export time, so they are
# baked into this build — re-run this whenever they change.
#
# Usage:
#   WEB_API_URL=https://dict.yourdomain.com \
#   WORDS_FEED_URL=https://words.yourdomain.com \
#   VM_HOST=ubuntu@vm.yourdomain.com \
#     npm run deploy:web:oracle
#
# Optional env:
#   VM_PATH=/var/www/wordbank-app/dist   # remote web root (default shown)
#   RELOAD_CADDY=1                       # `sudo systemctl reload caddy` over SSH after sync
#   SKIP_BUILD=1                         # rsync the existing dist/ without re-exporting
#
set -euo pipefail

# --- required config -------------------------------------------------------------
: "${WEB_API_URL:?Set WEB_API_URL to the dictionary API base, e.g. https://dict.yourdomain.com}"
: "${VM_HOST:?Set VM_HOST to the SSH target, e.g. ubuntu@vm.yourdomain.com}"

# --- optional config -------------------------------------------------------------
WORDS_FEED_URL="${WORDS_FEED_URL:-}"                  # trending-words feed (optional but recommended)
VM_PATH="${VM_PATH:-/var/www/wordbank-app/dist}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -z "$WORDS_FEED_URL" ]; then
    echo "⚠️  WORDS_FEED_URL is unset — the trending-words feed will be disabled in this build."
fi

# --- build -----------------------------------------------------------------------
if [ "${SKIP_BUILD:-0}" = "1" ]; then
    echo "▶ SKIP_BUILD=1 — reusing existing dist/"
    [ -d dist ] || { echo "✗ dist/ not found; run without SKIP_BUILD first." >&2; exit 1; }
else
    echo "▶ Exporting web build…"
    echo "    EXPO_PUBLIC_DICT_API_URL=$WEB_API_URL"
    echo "    EXPO_PUBLIC_WORDS_FEED_API_URL=${WORDS_FEED_URL:-<unset>}"
    rm -rf dist
    EXPO_PUBLIC_DICT_API_URL="$WEB_API_URL" \
    EXPO_PUBLIC_WORDS_FEED_API_URL="$WORDS_FEED_URL" \
        npx expo export --platform web
fi

# --- deploy ----------------------------------------------------------------------
echo "▶ Syncing dist/ → $VM_HOST:$VM_PATH …"
# --delete keeps the remote in lockstep (removes files no longer in the build).
rsync -avz --delete dist/ "$VM_HOST:$VM_PATH/"

if [ "${RELOAD_CADDY:-0}" = "1" ]; then
    echo "▶ Reloading Caddy on $VM_HOST …"
    ssh "$VM_HOST" "sudo systemctl reload caddy"
fi

echo "✓ Deployed to $VM_HOST:$VM_PATH"
echo "  Make sure Caddy serves it (see web.md → 6a) and the dir is readable."
