#!/bin/bash

# Check if PID file exists
if [ -f .server-pids ]; then
    # Read PIDs from file
    read FRONTEND_PID BACKEND_PID < .server-pids
    
    # Kill the processes
    echo "Stopping frontend server (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || true
    
    echo "Stopping backend server (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || true
    
    # Remove PID file
    rm .server-pids
    
    # Clean up any remaining processes on the ports
    echo "Cleaning up any remaining processes..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    lsof -ti :1337 | xargs kill -9 2>/dev/null || true
    
    echo "Servers stopped successfully!"
else
    echo "No server PIDs found. Cleaning up ports anyway..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    lsof -ti :1337 | xargs kill -9 2>/dev/null || true
    echo "Ports cleaned up!"
fi 