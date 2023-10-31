import { defineStore } from "pinia";
import { UserLogin } from "src/interfaces/IUser";
import { api } from "src/boot/axios";
import Router from "src/router";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    token: null,
    error: null,
    statusToken: false,
  }),
  getters: {
    getStatusToken: (state) => state.statusToken,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getError: (state) => state.error,
  },
  actions: {
    hasToken(token: boolean) {
      this.statusToken = token;
    },
    setToken(token: any) {
      this.token = token;
    },
    async doLogin({ email, password }: UserLogin) {
      try {
        const response = await api.post("/user/v1/login", {
          email: email,
          password: password,
        });
        if (response && response.data.token) {
          this.user = response.data.user;
          localStorage.setItem("token", response.data.token);
          this.hasToken(true);
          this.router.push("/");
        } else {
          console.error("Erro ao efetuar login: resposta vazia ou sem token");
        }
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          if (error.response.data.message.includes("401")) {
            error = "Credenciais inválidas";
          } else {
            error = error.response.data.message;
          }
        } else {
          error = "Erro ao efetuar login";
        }
      }
    },
    logout() {
      this.user = null;
      this.hasToken(false);
      if (Router) {
        Router.push("/"); // Utilizando o roteador importado
      } else {
        console.error("Router instance is not available");
      }
    },
  },
});
