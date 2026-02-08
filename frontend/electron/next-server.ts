import { ChildProcess, fork } from 'child_process';
import path from 'path';
import http from 'http';
import net from 'net';

let serverProcess: ChildProcess | null = null;

function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        server.close(() => resolve(address.port));
      } else {
        server.close(() => reject(new Error('Could not determine port')));
      }
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

function waitForServer(port: number, timeout = 30000): Promise<void> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Server did not start within ${timeout}ms`));
        return;
      }

      const req = http.get(`http://localhost:${port}`, (res) => {
        res.resume();
        resolve();
      });

      req.on('error', () => {
        setTimeout(check, 500);
      });

      req.end();
    };

    check();
  });
}

export async function startNextServer(): Promise<number> {
  const port = await findAvailablePort(3000);

  const standaloneDir = path.join(process.resourcesPath, 'standalone');
  const serverPath = path.join(standaloneDir, 'server.js');

  console.log(`Starting Next.js server on port ${port}...`);
  console.log(`Server path: ${serverPath}`);

  serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: 'localhost',
      NODE_ENV: 'production',
      IS_ELECTRON: 'true',
    },
    cwd: standaloneDir,
    stdio: 'pipe',
  });

  serverProcess.stdout?.on('data', (data: Buffer) => {
    console.log(`[Next.js] ${data.toString().trim()}`);
  });

  serverProcess.stderr?.on('data', (data: Buffer) => {
    console.error(`[Next.js Error] ${data.toString().trim()}`);
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start Next.js server:', err);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Next.js server exited with code ${code}`);
    serverProcess = null;
  });

  await waitForServer(port);
  console.log(`Next.js server is ready on port ${port}`);

  return port;
}

export function stopNextServer(): void {
  if (serverProcess) {
    console.log('Stopping Next.js server...');
    serverProcess.kill('SIGTERM');

    // Force kill after 5 seconds if still running
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }, 5000);

    serverProcess = null;
  }
}
