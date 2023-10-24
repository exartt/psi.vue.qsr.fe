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
      const token = localStorage.getItem("token");
      let state = null;
      const response = await fetch(
        "http://localhost:3030/calendar/v1/google-authenticate",
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      const data = await response.json();
      if (token) {
        state = encodeURIComponent(token);
        window.location.href = `${data.auth_url}&state=${state}`;
      } else {
        window.location.href = data.auth_url;
      }
    },
  },
});
</script>
