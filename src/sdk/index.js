const { createUnifiedModel } = require('../factory/create-unified-model.js');
const { streamChat, streamChatToStdout } = require('../core/stream-chat.js');
const {
  DEFAULTS,
  PROVIDER_SPECS,
  SUPPORTED_PROVIDERS,
} = require('../spec/provider-spec.js');

module.exports = {
  createUnifiedModel,
  streamChat,
  streamChatToStdout,
  DEFAULTS,
  PROVIDER_SPECS,
  SUPPORTED_PROVIDERS,
};
