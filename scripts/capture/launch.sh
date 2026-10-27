#!/bin/bash
# Usage: launch.sh <tab> <dark|light> [present]  — starts the demo app in the background and prints "pid wid".
DBG=/Users/prabhatkumar/Projects/utils/cleaner/.build/xcode/Build/Products/Debug/Sweepkey.app
HERE=$(cd "$(dirname "$0")" && pwd)
pkill -x Sweepkey; sleep 1
if [ "$2" = dark ]; then LOOK=(-AppleInterfaceStyle Dark); else LOOK=(-NSRequiresAquaSystemAppearance YES); fi
defaults write com.prabhatkumar.Sweepkey "NSWindow Frame main-AppWindow-1" "95 60 1280 800 0 0 1470 922 "
EXTRA=(); [ -n "${3:-}" ] && EXTRA=(-SweepkeyDemoPresent "$3")
open -g -n "$DBG" --args -ApplePersistenceIgnoreState YES -SweepkeyDemo YES -SweepkeyStartTab "$1" "${LOOK[@]}" "${EXTRA[@]}"
sleep 7
pid=$(pgrep -x Sweepkey | head -1); echo "$pid $("$HERE/winid" "$pid")"
