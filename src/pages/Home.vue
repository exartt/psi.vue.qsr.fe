<template>
  <q-page>
    <div class="row full-height">
      <div class="col-4 q-pa-md">
        <calendar-layout />
      </div>
      <div class="col-8 q-pa-md">
        <client-container />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CalendarLayout from "../components/CalendarHome/CalendarLayout.vue";
import ClientContainer from "src/components/ClientHome/ClientContainer.vue";

export default defineComponent({
  components: {
    CalendarLayout,
    ClientContainer,
  },
  name: "HomePage",
  setup() {
    return {};
  },
});
</script>

