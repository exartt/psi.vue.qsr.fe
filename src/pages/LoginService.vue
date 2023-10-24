<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="container-login column shadow-10">
      <div class="container-btn">
        <q-img></q-img>
        <q-input
          v-model="email"
          label="Email"
          outlined
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
        <q-input
          v-model="password"
          type="password"
          label="Senha"
          outlined
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
        <q-btn
          :disable="disableBtn"
          style="background: #ff0080; color: white"
          label="Entrar"
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
  max-width: 500px;
  max-height: 500px;
  height: 500px;
  width: 450px;
  border-radius: 15px;
}
.container-btn {
  width: 86%;
  align-self: center;
}

.container-btn .loginBtn {
  height: 45px;
}
</style>
