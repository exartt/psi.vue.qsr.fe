<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-list>
      <div v-for="(section, index) in sections" :key="index">
        <q-item
          v-for="(menu, indexMenu) in section.menus"
          :key="indexMenu"
          clickable
          v-ripple
          :to="menu.route"
        >
          <q-item-section avatar>
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>menu.name</q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Menu-Drawer",
  props: {
    sections: {
      type: Array,
      required: true,
    },
  },
});
</script>
