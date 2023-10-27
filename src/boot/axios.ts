import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
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

export const axiosInstance = axios.create();

// Request Interceptor
gateway.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // pegando o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
gateway.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('logout?')
      useAuthStore().logout();
      localStorage.removeItem("token"); // removendo o token do localStorage ao receber erro 401
      // Seu código para redirecionar o usuário para a página de login ou outra ação.
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axiosInstance;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$gateway = gateway;
});
