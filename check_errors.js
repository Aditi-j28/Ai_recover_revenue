import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

async function checkRuntime() {
  const server = await createServer({
    configFile: './vite.config.js',
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const { render } = await server.ssrLoadModule('./src/main.jsx');
    console.log("Loaded main.jsx successfully!");
  } catch (e) {
    console.error("Runtime error caught:", e);
  } finally {
    server.close();
  }
}

checkRuntime();
