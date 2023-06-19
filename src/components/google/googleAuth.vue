<template>
  <q-btn
    @click="authenticateWithGoogle"
    label="login with google"
    color="primary"
    flat
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    async authenticateWithGoogle() {
      const response = await fetch(
        "http://localhost:3030/calendar/v1/google-authenticate"
      );
      const data = await response.json();

      window.location.href = data.auth_url;
    },
  },
});
</script>
