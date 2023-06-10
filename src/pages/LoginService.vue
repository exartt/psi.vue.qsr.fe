<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div class="container-login column shadow-10">
      <div class="container-btn">
        <q-img></q-img>
        <q-input
          v-model="username"
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
          style="background: #ff0080; color: white"
          label="Entrar"
          class="loginBtn full-width"
          @click="doLogin"
        />
      </div>
    </div>
    <alert-card ref="alertCardRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthStore } from "src/stores/authStore";
import AlertCard from "src/components/components-structure/alertCard.vue";

export default defineComponent({
  name: "LoginService",
  components: {
    AlertCard,
  },
  setup() {
    const password = ref("");
    const username = ref("");
    const alertCardRef = ref(null);

    const verifyFields = () => {
      if (!password.value || !username.value) {
        // TODO -> substituir pelo sweetalert
        alertCardRef.value.showError(
          "Oops!",
          "Por favor, preencha todos os campos obrigatórios para que possamos prosseguir."
        );
        return false;
      }
      return true;
    };

    const doLogin = async () => {
      if (verifyFields()) {
        await useAuthStore().doLogin({
          username: username.value,
          password: password.value,
        });
      }
    };

    return {
      verifyFields,
      password,
      username,
      doLogin,
      alertCardRef,
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
