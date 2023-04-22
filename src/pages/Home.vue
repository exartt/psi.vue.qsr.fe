<template>
  <q-page padding>
    <calendar-layout></calendar-layout>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CalendarLayout from "../components/CalendarHome/CalendarLayout.vue";
export default defineComponent({
  components: { CalendarLayout },
  name: "HomePage",
  setup () {
    return {
    }
  }
});
</script>
