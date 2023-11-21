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
          @click="handlerClick"
        />

        <q-toolbar-title class="color-white">
          Sistema Clínica Psicologica
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <menu-drawer ref="drawer" :sections="sections" />
    <q-page-container class="bg-grey-7">
      <router-view class="bg-grey-7" />
    </q-page-container>
  </q-layout>
  <alert-card />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MenuDrawer from "src/components/components-structure/menu-drawer.vue";
import alertCard from "src/components/components-structure/alertCard.vue";
export default defineComponent({
  name: "MainLayout",

  components: {
    MenuDrawer,
    alertCard,
  },
  methods: {
    handlerClick() {
      this.$swal.fire("Hello Vue world!!!");
    },
  },
  setup() {
    return {
      sections: [
        {
          menus: [
            {
              route: "/",
              icon: "home",
              name: "Início",
            },
            {
              route: "/agenda",
              icon: "calendar_month",
              name: "Agenda",
              disabled: true,
            },
            {
              route: "/pacientes",
              icon: "person",
              name: "Pacientes",
            },
          ],
        },
        {
          title: "Financeiro",
          menus: [
            {
              route: "/contas-receber",
              icon: "monetization_on",
              name: "Entrada",
              color: "green",
              disabled: false,
            },
            {
              route: "/contas-pagar",
              icon: "paid",
              name: "Saída",
              color: "red",
              disabled: true,
            },
            {
              route: "/fluxo-caixa",
              icon: "point_of_sale",
              name: "Fluxo de caixa",
              disabled: false,
            },
          ],
        },
        {
          title: "Estatísticas",
          menus: [
            {
              route: "/dashboard",
              icon: "space_dashboard",
              name: "Dashboard",
              disabled: true,
            },
            {
              route: "/marketing",
              icon: "campaign",
              name: "Marketing",
              disabled: true,
            },
            {
              route: "/metas",
              icon: "flag",
              name: "Metas",
              disabled: true,
            },
          ],
        },
      ],
    };
  },
});
</script>

<style scoped>
.color-white {
  color: #ffffff;
}
</style>
