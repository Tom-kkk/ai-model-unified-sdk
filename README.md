# ai-model-unified-sdk

一个面向多模型厂商的轻量统一 SDK。当前支持 `alibaba`、`baidu`、`zhipu`，提供一致的流式对话调用接口。

## 背景

不同模型厂商在鉴权、Base URL、模型名和响应流格式上存在差异，业务接入时容易出现重复代码和切换成本高的问题。  
本项目的目标是：**用一个统一入口屏蔽厂商差异，让调用层只关注 prompt 和输出流**。

## 设计思路

- **统一入口**：通过 `createUnifiedModel()` 和 `streamChat()` 暴露稳定 API。
- **配置驱动**：在 `provider-spec` 中维护厂商默认配置（环境变量名、默认模型、默认地址、默认路径）。
- **流式优先**：统一返回异步流事件，便于实时输出和后续扩展（usage、finish reason）。
- **Node 原生实现**：不依赖重型框架，适合二次封装到网关或服务端。

## 设计模式

- **工厂模式（Factory）**：`createUnifiedModel` 按 provider 创建对应实现。
- **适配器模式（Adapter）**：每个厂商适配器将“厂商协议”转换为“统一事件流”。
- **策略模式（Strategy）**：运行时通过 provider 切换具体策略，无需改业务调用代码。
- **规格中心（Specification）**：`provider-spec` 作为配置与约束中心，减少硬编码。

## 如何使用（简洁版）

### 1) 安装与环境变量

```bash
npm install ai-model-unified-sdk
```

复制 `.env.example` 为 `.env`，至少配置你要使用厂商的 `API_KEY`（可选配置 `BASE_URL`、`MODEL`）。

### 2) 代码调用（推荐）

```js
require('dotenv').config();
const { streamChat } = require('ai-model-unified-sdk');

async function main() {
  const stream = await streamChat({
    provider: 'zhipu',
    prompt: '用两句话介绍什么是统一模型网关。',
  });

  for await (const event of stream) {
    if (event.type === 'text-delta') process.stdout.write(event.text);
  }
  process.stdout.write('\n');
}

main();
```

### 3) 命令行 Demo（仓库内）

```bash
npm start -- --provider zhipu --prompt "你好，请做自我介绍"
```

## 导出能力

- `createUnifiedModel(options)`：创建指定厂商客户端。
- `streamChat(options)`：返回统一的异步事件流。
- `streamChatToStdout(options)`：流式输出到终端并返回结束信息。
- `DEFAULTS / PROVIDER_SPECS / SUPPORTED_PROVIDERS`：默认值与厂商规格信息。

