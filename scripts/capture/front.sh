#!/bin/bash
# Usage: front.sh <out.png> — captures the demo app's frontmost window; for a sheet, macOS returns
# the whole window with the sheet composited in.
HERE=$(cd "$(dirname "$0")" && pwd)
pid=$(pgrep -x Sweepkey | head -1)
id=$("$HERE/winlist" "$pid" | head -1 | cut -d' ' -f1)
screencapture -x -o -l "$id" "$1" && echo "$(basename "$1")"
