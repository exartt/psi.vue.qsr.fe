import { defineStore } from "pinia";
import { inject } from "vue";
import { api } from "src/boot/axios";
import { UserLogin } from "src/interfaces/IUser";
import { UtilKey } from "src/util/utils";
import { IUtils } from "src/interfaces/IUtil";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    error: null,
    token: null,
    tokenExpiration: null,
  }),
  getters: {
    getUser: (state) => state.user,
    getError: (state) => state.error,
    getToken: (state) => state.token,
    getTokenExpiration: (state) => state.tokenExpiration,
  },
  actions: {
    async doLogin({ username, password }: UserLogin) {
      const utils = inject<IUtils>(UtilKey) as any;
      try {
        utils.showLoading("Efetuando login");
        await api.post("/login", { username, password }).then((response) => {
          this.user = response.data;
        });
      } catch (error: any) {
        this.error = error.response.data.message;
        console.error("Erro ao efetuar login");
      } finally {
        utils.hideLoading();
      }
    },
  },
});
