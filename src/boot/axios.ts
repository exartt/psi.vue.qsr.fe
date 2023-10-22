import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "stores/authStore";
import { useRouter } from "vue-router";
import { Cookies } from "quasar";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
    $gateway: AxiosInstance;
  }
}

export const api = axios.create({ baseURL: "http://localhost:3020" });

const gateway = axios.create({ baseURL: "http://localhost:3030" });

gateway.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.getToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

gateway.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const router = useRouter();
      const authStore = useAuthStore();
      authStore.logout();
      router.push("/");
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  const axiosInstance = axios.create();

  app.config.globalProperties.$axios = axiosInstance;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$gateway = gateway;
});
