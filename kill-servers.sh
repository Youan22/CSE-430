#!/usr/bin/env bash
set -euo pipefail

# kill-servers.sh
# Finds listening TCP processes owned by the current user and optionally kills them.
# Safe defaults: shows a dry-run list and asks for confirmation. Use --force to skip prompt and SIGKILL lingering processes.

FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

USER_NAME=$(id -un)

echo "Searching for listening TCP processes owned by user: $USER_NAME"

# Gather unique PID, CMD, ADDRESS:PORT lines for listening TCP sockets owned by the user
mapfile -t PROCS < <(lsof -nP -iTCP -sTCP:LISTEN -u "$USER_NAME" 2>/dev/null | awk 'NR>1 {print $2"|"$1"|"$9}' | sort -u)

if [ ${#PROCS[@]} -eq 0 ]; then
  echo "No listening TCP processes found for user $USER_NAME. Nothing to kill."
  exit 0
fi

echo "Found the following listening processes:"
for entry in "${PROCS[@]}"; do
  PID=${entry%%|*}
  REM=${entry#*|}
  CMD=${REM%%|*}
  ADDR=${REM#*|}
  printf "  PID %-6s CMD %-15s ADDR %s\n" "$PID" "$CMD" "$ADDR"
done

if [ $FORCE -eq 0 ]; then
  read -r -p "Kill these processes? (y/N) " REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted. No processes were killed. You can rerun with --force to skip prompt." 
    exit 0
  fi
fi

# Kill the PIDs (attempt graceful, then SIGKILL if --force)
for entry in "${PROCS[@]}"; do
  PID=${entry%%|*}
  echo "Killing PID $PID ..."
  kill "$PID" 2>/dev/null || true
  # If still alive after a short wait and user passed --force, force kill
  sleep 1
  if kill -0 "$PID" 2>/dev/null; then
    if [ $FORCE -eq 1 ]; then
      echo "PID $PID still alive; sending SIGKILL"
      kill -9 "$PID" 2>/dev/null || echo "Failed to kill $PID"
    else
      echo "PID $PID did not exit immediately; rerun with --force to SIGKILL." 
    fi
  else
    echo "PID $PID terminated." 
  fi
done

echo "Done."
