<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="container-login column shadow-10">
      <q-img src="src/assets/images/login-header.webp" class="q-my-md" sizes="sm" height="150px" width="150px" style="border-radius: 150px; align-self: center;"/>
      <div>
        <span class="text-h6 font-color">Bem vindo ao <br> Contador da Psicóloga</span>
      </div>
      <div class="container-btn q-pb-xl">
        <q-input
          v-model="email"
          label="Email"
          outlined
          dense
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
        <q-input
          v-model="password"
          type="password"
          label="Senha"
          outlined
          dense
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
        <q-btn
          :disable="disableBtn"
          style="background: green; color: white"
          label="Entrar"
          dense
          :loading="disableBtn"
          class="loginBtn full-width"
          @click.stop="doLogin"
        >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Loading...
        </template>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { useSweetAlert2 } from "src/composables/useSweetalert";

const message = useSweetAlert2();

export default defineComponent({
  name: "LoginService",

  setup() {
    const disableBtn = ref(false);
    const password = ref("");
    const email = ref("");

    const verifyFields = () => {
      if (!password.value || !email.value) {
        message.fire({
          icon: "error",
          title: "Oops!",
          text: "Por favor, preencha todos os campos obrigatórios para que possamos prosseguir."
        });
        return false;
      }
      return true;
    };

    const doLogin = async () => {
      if (verifyFields()) {
        disableBtn.value = true;

        try {
          await useAuthStore().doLogin({
            email: email.value,
            password: password.value,
          });
        } catch (error) {
          console.error("Ocorreu um erro durante o login:", error);
        } finally {
          disableBtn.value = false;
        }
      }
    };



    return {
      verifyFields,
      password,
      email,
      doLogin,
      disableBtn,
    };
  },
});
</script>

<style lang="scss" scoped>
.container-login {
  justify-content: space-between;
  max-width: 500px;
  max-height: 500px;
  height: 500px;
  width: 450px;
  border-radius: 4px;
}
.container-btn {
  width: 86%;
  align-self: center;
}

.container-btn .loginBtn {
  height: 45px;
}
.font-color {
  color: #44444B;
}
</style>
