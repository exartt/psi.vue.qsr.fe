<template>
  <q-layout view="hHh Lpr lff">
    <q-header>
      <q-toolbar class="primary">
        <q-btn
          class="color-white"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="color-white">
          Sistema Clínica Psicologica
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <menu-drawer :sections="sections" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <alert-card />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import menuDrawer from "src/components/components-structure/menu-drawer.vue";
import alertCard from "src/components/components-structure/alertCard.vue";
export default defineComponent({
  name: "MainLayout",

  components: {
    menuDrawer,
    alertCard,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      sections: [
        {
          menus: [
            {
              route: "/home",
              icon: "home",
              name: "Início",
            },
          ],
        },
        {
          menus: [
            {
              route: "/agenda",
              icon: "calendar_month",
              name: "Início",
            },
            {
              route: "/calendario",
              icon: "event",
              name: "event",
            },
            {
              route: "/dashboard",
              icon: "space_dashboard",
              name: "Dashboard",
            },
          ],
        },
      ],
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style scoped>
.color-white {
  color: #ffffff;
}
</style>
