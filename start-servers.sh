#!/bin/bash

# Function to check if a port is in use
check_port() {
  lsof -i :$1 > /dev/null 2>&1
  return $?
}

# Kill any processes using ports 3000 and 1337
echo "Checking for existing processes on ports 3000 and 1337..."
if check_port 3000; then
  echo "Killing process on port 3000 (frontend)"
  lsof -ti :3000 | xargs kill -9
fi

if check_port 1337; then
  echo "Killing process on port 1337 (backend)"
  lsof -ti :1337 | xargs kill -9
fi

# Start backend server
echo "Starting Strapi backend server..."
cd backend-strapi
npm run develop > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start frontend server
echo "Starting React frontend server..."
cd frontend-react
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Save PIDs to a file for stopping later
echo $FRONTEND_PID $BACKEND_PID > .server-pids

echo "Both servers are starting in the background..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:1337"
echo ""
echo "To stop the servers, run: ./stop-servers.sh"
echo "To view logs:"
echo "  Frontend logs: tail -f frontend.log"
echo "  Backend logs: tail -f backend.log" 