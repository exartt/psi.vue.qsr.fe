<template>
  <q-page padding>
    <calendar :events="events" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import useApi from "src/composables/requests";
import Calendar from "src/components/components-structure/calendar.vue";
export default defineComponent({
  name: "ScheduleService",
  components: {
    Calendar,
  },
  setup() {
    onMounted(() => {
      getAppointments();
    });
    const schedule = "/schedule/v1";
    const events = ref([]);
    const { get, post, error } = useApi();

    const getAppointments = async (year: number = 2023) => {
      const url = `${schedule}/list-appointments?year=${year}`;
      const data = await get(url, false);
      console.log(data);
      events.value = data;
    };

    return { events };
  },
});
</script>
