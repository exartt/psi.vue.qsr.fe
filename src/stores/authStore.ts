import { defineStore } from 'pinia'
import { inject } from 'vue'
import { api } from 'src/boot/axios'
import { UserLogin } from 'src/interfaces/IUser'
import { UtilKey } from 'src/util/utils'
import { IUtils } from 'src/util/IUtil'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null
  }),
  actions: {
    async doLogin({ username, password } : UserLogin) {
      const utils = inject<IUtils>(UtilKey) as any;
      try {
        utils.showLoading('Efetuando login')
        await api.post('/login', { username, password }).then(response => {
          // this.user = response.data;
        })
      } catch (error: any) {
        this.error = error.response.data.message;
        console.error('Erro ao efetuar login');
      } finally {
        // utils.hideLoading()
      }
    }
  }
})

