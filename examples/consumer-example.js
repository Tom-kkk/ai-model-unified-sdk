require('dotenv').config();

const { streamChat } = require('ai-model-unified-sdk');

async function main() {
  const stream = await streamChat({
    provider: 'zhipu',
    prompt: '用两句话介绍什么是统一模型网关。',
  });

  for await (const event of stream) {
    if (event.type === 'text-delta') {
      process.stdout.write(event.text);
    }
  }

  process.stdout.write('\n');
}

main().catch(error => {
  console.error('[consumer-example] failed:', error.message);
  process.exitCode = 1;
});
