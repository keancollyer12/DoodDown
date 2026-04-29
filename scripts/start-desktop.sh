#!/usr/bin/env bash
set -euo pipefail

export DISPLAY=${DISPLAY:-:0}
export XVFB_WHD=${XVFB_WHD:-1280x720x24}
export VNC_PORT=${VNC_PORT:-5900}
export NOVNC_PORT=${NOVNC_PORT:-6080}

Xvfb "$DISPLAY" -screen 0 "$XVFB_WHD" -ac -nolisten tcp &

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

novnc_proxy --vnc localhost:"$VNC_PORT" --listen "$NOVNC_PORT" --web /usr/share/novnc/ >/tmp/novnc.log 2>&1 &

echo "Desktop started. DISPLAY=$DISPLAY VNC_PORT=$VNC_PORT noVNC_PORT=$NOVNC_PORT"
