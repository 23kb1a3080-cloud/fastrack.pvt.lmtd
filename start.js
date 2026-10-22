// start.js - Production startup wrapper for Zoho Catalyst AppSail & Next.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 3000;
console.log(`[Zoho Catalyst AppSail] Launching Next.js application on port: ${port}...`);

process.env.PORT = port.toString();
process.env.NODE_ENV = 'production';

const serverFile = path.join(__dirname, 'server.js');
if (fs.existsSync(serverFile)) {
  require(serverFile);
} else {
  const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'start', '-p', port.toString()], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port.toString(),
      NODE_ENV: 'production',
    },
  });

  child.on('exit', (code) => {
    console.log(`[Zoho Catalyst AppSail] Server process exited with code ${code}`);
    process.exit(code || 0);
  });

  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}
