<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :width="200"
    class="menu-drawer"
    bordered
    ref="drawerRef"
  >
    <q-list>
      <div v-for="(section, index) in sections" :key="index">
        <q-item-label header v-if="section.title">
          {{ section.title }}
        </q-item-label>
        <q-item
          v-for="(menu, indexMenu) in section.menus"
          :key="indexMenu"
          clickable
          v-ripple
          class="unselected-item row"
          :to="'/Default' + menu.route"
        >
          <q-item-section avatar class="col-auto">
            <q-icon :name="'r_' + menu.icon" />
          </q-item-section>
          <q-item-section class="col">{{ menu.name }}</q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Menu-Drawer",
  computed: {
    bgColor() {
      return this.$q.dark.isActive ? "bg-darkPrimary" : "bg-primary";
    },
  },
  mounted() {
    console.log(this.$refs.drawerRef);
  },
  setup() {
    return {
      drawer: ref(true),
      miniState: ref(true),
    };
  },
  props: {
    sections: {
      type: Array,
      required: true,
    },
  },
});
</script>

<style scoped>
.menu-drawer {
  color: #bdc3c7;
}
.unselected-item {
  color: #7f8c8d;
}
</style>
