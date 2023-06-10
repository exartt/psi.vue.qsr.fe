import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
// import { useStore } from 'pinia';
import { useRouter } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: 'http://localhost:3020' })

// function addAuthorizationHeader(config: AxiosRequestConfig): AxiosRequestConfig {
//   const store = useStore();
//   const token = store.state.auth.token;
//   const tokenExpiration = store.state.auth.tokenExpiration;
//   const router = useRouter();

//   if (token && tokenExpiration && new Date(tokenExpiration) > new Date()) {
//     config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
//   } else {
//     router.push('/login');
//   }

//   return config;
// }

export default boot(({ app }) => {
  const axiosInstance = axios.create()
  // axiosInstance.interceptors.request.use(addAuthorizationHeader);

  app.config.globalProperties.$axios = axiosInstance
  app.config.globalProperties.$api = api
})
