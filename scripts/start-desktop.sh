#!/usr/bin/env bash
set -euo pipefail

export DISPLAY=${DISPLAY:-:0}
export XVFB_WHD=${XVFB_WHD:-1280x720x24}
export VNC_PORT=${VNC_PORT:-5900}
export NOVNC_PORT=${NOVNC_PORT:-6080}

Xvfb "$DISPLAY" -screen 0 "$XVFB_WHD" -ac -nolisten tcp &

for i in $(seq 1 50); do
  if xdpyinfo -display "$DISPLAY" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done

fluxbox >/tmp/fluxbox.log 2>&1 &

x11vnc \
  -display "$DISPLAY" \
  -rfbport "$VNC_PORT" \
  -shared \
  -forever \
  -nopw \
  -xkb \
  -noxrecord -noxfixes -noxdamage \
  >/tmp/x11vnc.log 2>&1 &

NOVNC_PROXY_BIN=""
if command -v novnc_proxy >/dev/null 2>&1; then
  NOVNC_PROXY_BIN="novnc_proxy"
elif [ -x /usr/share/novnc/utils/novnc_proxy ]; then
  NOVNC_PROXY_BIN="/usr/share/novnc/utils/novnc_proxy"
fi

if [ -z "$NOVNC_PROXY_BIN" ]; then
  echo "novnc_proxy not found" >&2
  exit 1
fi

"$NOVNC_PROXY_BIN" --vnc localhost:"$VNC_PORT" --listen "$NOVNC_PORT" --web /usr/share/novnc/ >/tmp/novnc.log 2>&1 &

echo "Desktop started. DISPLAY=$DISPLAY VNC_PORT=$VNC_PORT noVNC_PORT=$NOVNC_PORT"
