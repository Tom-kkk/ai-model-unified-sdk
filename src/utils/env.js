const fs = require('node:fs');
const path = require('node:path');

function resolveDefaultEnvPath() {
  const candidates = [
    path.resolve(process.cwd(), 'demo', '.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

function loadEnvFile(filePath = resolveDefaultEnvPath()) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  for (const line of content.split('\n')) {
    const text = line.trim();
    if (!text || text.startsWith('#')) continue;

    const separatorIndex = text.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = text.slice(0, separatorIndex).trim();
    const value = text.slice(separatorIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getEnv(name) {
  return process.env[name];
}

function getEnvOrThrow(name, provider) {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`[${provider}] missing env: ${name}`);
  }
  return value;
}

module.exports = {
  loadEnvFile,
  getEnv,
  getEnvOrThrow,
};
