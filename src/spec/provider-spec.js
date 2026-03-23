const SUPPORTED_PROVIDERS = ['alibaba', 'baidu', 'zhipu'];

const DEFAULTS = {
  prompt: '用简洁中文介绍你自己，并给出三条能力要点。',
  chatCompletionsPath: '/chat/completions',
};

const PROVIDER_SPECS = {
  alibaba: {
    env: {
      model: 'ALIBABA_MODEL',
      apiKey: 'ALIBABA_API_KEY',
      baseURL: 'ALIBABA_BASE_URL',
    },
    defaultModel: 'qwen-plus',
    defaultBaseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
    defaultPath: '/chat/completions',
  },
  baidu: {
    env: {
      model: 'BAIDU_MODEL',
      apiKey: 'BAIDU_API_KEY',
      baseURL: 'BAIDU_BASE_URL',
    },
    defaultModel: 'ernie-4.0-8k',
    defaultBaseURL: 'https://qianfan.baidubce.com/v2',
    defaultPath: '/chat/completions',
  },
  zhipu: {
    env: {
      model: 'ZHIPU_MODEL',
      apiKey: 'ZHIPU_API_KEY',
      baseURL: 'ZHIPU_BASE_URL',
    },
    defaultModel: 'glm-4-flash',
    defaultBaseURL: 'https://open.bigmodel.cn/api/paas/v4',
    defaultPath: '/chat/completions',
  },
};

function normalizeProvider(input) {
  return String(input).trim().toLowerCase();
}

function assertSupportedProvider(provider) {
  if (!SUPPORTED_PROVIDERS.includes(provider)) {
    throw new Error(
      `Invalid provider "${provider}". supported: ${SUPPORTED_PROVIDERS.join(', ')}`,
    );
  }
}

module.exports = {
  DEFAULTS,
  PROVIDER_SPECS,
  SUPPORTED_PROVIDERS,
  normalizeProvider,
  assertSupportedProvider,
};
