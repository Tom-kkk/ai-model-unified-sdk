function parseSseEvent(rawEvent) {
  const lines = rawEvent.split('\n');
  let data = '';

  for (const line of lines) {
    if (line.startsWith('data:')) {
      data += `${line.slice(5).trimStart()}\n`;
    }
  }

  return data.trim();
}

async function* parseSseDataStream(readableStream) {
  const reader = readableStream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';

    for (const chunk of chunks) {
      const data = parseSseEvent(chunk);
      if (data) {
        yield data;
      }
    }
  }

  if (buffer.trim()) {
    const data = parseSseEvent(buffer);
    if (data) {
      yield data;
    }
  }
}

module.exports = {
  parseSseDataStream,
};
