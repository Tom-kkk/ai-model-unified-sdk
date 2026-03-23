const { parseSseDataStream } = require('../utils/sse.js');

function withoutTrailingSlash(url) {
  return String(url).replace(/\/+$/, '');
}

async function* streamOpenAICompatible(options) {
  const url = `${withoutTrailingSlash(options.baseURL)}${options.path}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${options.apiKey}`,
    ...options.headers,
  };

  const body = {
    model: options.model,
    messages: [{ role: 'user', content: options.prompt }],
    stream: true,
    stream_options: { include_usage: true },
  };

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    const detail = error?.cause?.message ?? error?.message ?? String(error);
    throw new Error(`[${options.provider}] network error: ${detail}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[${options.provider}] request failed ${response.status}: ${errorText}`,
    );
  }

  if (!response.body) {
    throw new Error(`[${options.provider}] empty response body`);
  }

  for await (const data of parseSseDataStream(response.body)) {
    if (data === '[DONE]') {
      yield { type: 'finish', reason: 'stop' };
      break;
    }

    let json;
    try {
      json = JSON.parse(data);
    } catch {
      continue;
    }

    const choice = json.choices?.[0];
    const deltaText = choice?.delta?.content ?? '';
    if (deltaText) {
      yield { type: 'text-delta', text: deltaText };
    }

    if (choice?.finish_reason) {
      yield { type: 'finish', reason: choice.finish_reason };
    }

    if (json.usage) {
      yield { type: 'usage', usage: json.usage };
    }
  }
}

module.exports = {
  streamOpenAICompatible,
};
