const { createAlibabaAdapter } = require('../adapters/alibaba-adapter.js');
const { createBaiduAdapter } = require('../adapters/baidu-adapter.js');
const { createZhipuAdapter } = require('../adapters/zhipu-adapter.js');
const {
  assertSupportedProvider,
  normalizeProvider,
} = require('../spec/provider-spec.js');

function createUnifiedModel(options) {
  const provider = normalizeProvider(options.provider);
  assertSupportedProvider(provider);

  switch (provider) {
    case 'alibaba':
      return createAlibabaAdapter(options);
    case 'baidu':
      return createBaiduAdapter(options);
    case 'zhipu':
      return createZhipuAdapter(options);
    default:
      throw new Error(`Unsupported provider "${provider}"`);
  }
}

module.exports = {
  createUnifiedModel,
};
