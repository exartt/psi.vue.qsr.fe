import { boot } from "quasar/wrappers";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "stores/authStore";
import { useRouter } from "vue-router";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
    $gateway: AxiosInstance;
  }
}

export const api = axios.create({ baseURL: "http://localhost:3020" });

const gateway = axios.create({ baseURL: "http://localhost:3030" });

function addAuthorizationHeader(
  config: AxiosRequestConfig
): AxiosRequestConfig {
  const store = useAuthStore();
  const token = store.getToken;
  const tokenExpiration = store.getTokenExpiration;
  const router = useRouter();

  if (token && tokenExpiration && new Date(tokenExpiration) > new Date()) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  } else {
    router.push("/login");
  }

  return config;
}

export default boot(({ app }) => {
  const axiosInstance = axios.create();
  // axiosInstance.interceptors.request.use(addAuthorizationHeader);

  app.config.globalProperties.$axios = axiosInstance;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$gateway = gateway;
});
