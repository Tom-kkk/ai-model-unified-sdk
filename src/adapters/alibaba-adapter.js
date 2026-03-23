const { PROVIDER_SPECS } = require('../spec/provider-spec.js');
const { getEnv, getEnvOrThrow } = require('../utils/env.js');
const { streamOpenAICompatible } = require('./openai-compatible-native.js');

function createAlibabaAdapter(options = {}) {
  const spec = PROVIDER_SPECS.alibaba;

  return {
    provider: 'alibaba',
    model: options.model ?? getEnv(spec.env.model) ?? spec.defaultModel,
    baseURL: options.baseURL ?? getEnv(spec.env.baseURL) ?? spec.defaultBaseURL,
    path: options.path ?? spec.defaultPath,
    apiKey: options.apiKey ?? getEnvOrThrow(spec.env.apiKey, 'alibaba'),
    stream: streamOpenAICompatible,
  };
}

module.exports = {
  createAlibabaAdapter,
};
