<template>
  <q-page padding>
    <calendar v-if="!loading" :events="events" />
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
    const { get } = useApi();
    const loading = ref(false);

    const getAppointments = async (year: number = 2023) => {
      loading.value = true;
      const url = `${schedule}/list-appointments?year=${year}`;
      const data = await get(url, false);
      events.value = data;
      loading.value = false;
    };

    return { events, loading };
  },
});
</script>

<style lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2em;
}
</style>
