<template>
  <q-drawer
    show-if-above
    :mini="miniState"
    mini-to-overlay
    :width="200"
    class="custom-drawer"
    bordered
    :style="bgColor"
  >
    <q-list class="row justify-center full-height" style="align-items: center">
      <div v-for="(section, index) in sections" :key="index" class="full-width">
        <q-item-label header v-if="section.title">
          {{ section.title }}
        </q-item-label>
        <q-item
          v-for="(menu, indexMenu) in section.menus"
          :key="indexMenu"
          clickable
          v-ripple="!menu.disabled"
          class="unselected-item"
          :to="menu.route"
          :disable="menu.disabled"
        >
          <q-item-section avatar>
            <q-icon :name="'r_' + menu.icon" :style="'color:' + menu.color" />
          </q-item-section>
          <q-item-section class="col">{{ menu.name }}</q-item-section>
          <q-tooltip v-if="miniState && !menu.disabled">
            {{ menu.name }}
          </q-tooltip>
          <q-tooltip v-else> Developing </q-tooltip>
        </q-item>
      </div>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Section } from "src/interfaces/IMenuDrawer";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "MenuDrawer",

  setup() {
    const miniState = ref(true);
    const route = useRoute();
    const bgColor = computed(() => {
      return miniState.value ? "bg-darkPrimary" : "bg-primary";
    });
    // Todo -> implementação futura.
    // const highlightSelectedRoute = computed(() => {
    //   let isRouteSelected: boolean = false;
    //   props.sections.forEach((element: Section) => {
    //     element.menus.forEach(m => {
    //       if(m.route === route.path) {
    //         isRouteSelected = true
    //       }
    //       Object.assign(m, { highlighted: isRouteSelected });
    //     })
    //   });
    //   return isRouteSelected;
    // });

    const handlerDrawer: () => void = () => {
      miniState.value = !miniState.value;
    };

    return {
      miniState,
      bgColor,
      handlerDrawer,
    };
  },

  props: {
    sections: {
      type: Array as () => Section[],
      required: true,
    },
  },
});
</script>

<style scoped>
.unselected-item {
  color: #7f8c8d;
}
.custom-drawer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #bdc3c7;
}
.custom-drawer .q-list {
  display: flex;
  flex-direction: column;
}
</style>
