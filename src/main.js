import App from "./App.vue";
import "./assets/css/tailwind.css";
import { createApp, h, provide, render } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApolloProvider } from "@vue/apollo-option";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// 缓存实现
const cache = new InMemoryCache();

// 创建 HTTP 链接
const httpLink = createHttpLink({
  uri: "https://intolive-production.up.railway.app/graphql",
});

// 创建 WebSocket 链接
const wsLink = new WebSocketLink({
  uri: "wss://intolive-production.up.railway.app/ws/ingredients/",
  options: {
    reconnect: true,
  },
});

// 使用 split 函数来将查询和变更操作发送到 HTTP 链接，将订阅操作发送到 WebSocket 链接
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link,
  cache,
});

// 创建 apollo provider
const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

// 创建 vue 应用
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

// 挂载 vue 应用
app.use(apolloProvider).mount("#app");
