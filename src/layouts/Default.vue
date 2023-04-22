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
          @click="handlerDrawer"
        />

        <q-toolbar-title class="color-white">
          Sistema Clínica Psicologica
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <menu-drawer ref="drawer" :sections="sections" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <alert-card/>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import MenuDrawer from "src/components/components-structure/menu-drawer.vue";
import AlertCard from "src/components/components-structure/alertCard.vue";
import { sections } from "src/interfaces/IMenuDrawer"
export default defineComponent({
  name: "DefaultLayout",

  components: {
    MenuDrawer,
    AlertCard,
  },
  setup() {
    const drawer = ref<InstanceType<typeof MenuDrawer>>();
    const handlerDrawer: () => void = () => {
      drawer.value.handlerDrawer();
    }
    return {
      sections,
      handlerDrawer,
      drawer
    };
  },
});
</script>

<style scoped>
.color-white {
  color: #ffffff;
}
</style>
