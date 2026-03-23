const { DEFAULTS } = require('../spec/provider-spec.js');
const { createUnifiedModel } = require('../factory/create-unified-model.js');

async function streamChat(options) {
  const prompt = options.prompt ?? DEFAULTS.prompt;
  const client = createUnifiedModel(options);

  const stream = client.stream({
    provider: client.provider,
    apiKey: client.apiKey,
    baseURL: client.baseURL,
    path: client.path,
    model: client.model,
    prompt,
  });

  return stream;
}

async function streamChatToStdout(options) {
  const stream = await streamChat(options);
  let finishReason = 'unknown';
  let usage = null;

  for await (const event of stream) {
    if (event.type === 'text-delta') {
      process.stdout.write(event.text);
      continue;
    }

    if (event.type === 'finish') {
      finishReason = event.reason;
      continue;
    }

    if (event.type === 'usage') {
      usage = event.usage;
    }
  }

  return {
    finishReason,
    usage,
  };
}

module.exports = {
  streamChat,
  streamChatToStdout,
};
