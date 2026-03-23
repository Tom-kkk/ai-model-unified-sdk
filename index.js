#!/usr/bin/env node
const process = require('node:process');
const { streamChatToStdout } = require('./src/core/stream-chat.js');
const {
  assertSupportedProvider,
  DEFAULTS,
  normalizeProvider,
} = require('./src/spec/provider-spec.js');
const { getEnv, loadEnvFile } = require('./src/utils/env.js');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      args[key] = 'true';
      continue;
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

async function main() {
  loadEnvFile();
  const args = parseArgs(process.argv.slice(2));
  const provider = normalizeProvider(args.provider ?? getEnv('DEMO_PROVIDER') ?? 'alibaba');
  assertSupportedProvider(provider);

  const prompt = args.prompt ?? getEnv('DEMO_PROMPT') ?? DEFAULTS.prompt;

  console.log(`[demo] provider=${provider}`);
  if (args.model) {
    console.log(`[demo] model=${args.model}`);
  }
  console.log('[demo] streaming...\n');

  const output = await streamChatToStdout({
    provider,
    model: args.model,
    prompt,
  });

  console.log('\n');
  console.log('[demo] finishReason:', output.finishReason);
  console.log('[demo] usage:', output.usage);
}

main().catch(error => {
  console.error('\n[demo] failed:', error.message);
  process.exitCode = 1;
});
