#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const serverScript = path.join(__dirname, '..', 'athena_mcp', 'server.py');
const python = process.platform === 'win32' ? 'python' : 'python3';

const proc = spawn(python, [serverScript], {
  stdio: 'inherit',
  env: { ...process.env },
});

proc.on('error', (err) => {
  process.stderr.write(`Failed to start ATHENA MCP server: ${err.message}\n`);
  process.exit(1);
});

proc.on('exit', (code) => process.exit(code ?? 0));
