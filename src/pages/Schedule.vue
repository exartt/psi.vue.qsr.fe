<template>
  <q-page padding>
    <calendar :events="events" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Calendar from "src/components/components-structure/calendar.vue";
export default defineComponent({
  name: "ScheduleService",
  components: {
    Calendar,
  },
  setup() {
    const events = [
      {
        title: "Reunião com o cliente",
        start: "2023-06-12",
        end: "2023-06-12",
      },
      {
        title: "Treinamento da equipe",
        start: "2023-06-15T10:00:00",
        end: "2023-06-15T12:00:00",
      },
      {
        title: "Almoço com colegas",
        start: "2023-06-18T13:00:00",
        end: "2023-06-18T14:00:00",
      },
      { title: "Aniversário de um amigo", start: "2023-06-20" },
      {
        title: "Conferência online",
        start: "2023-06-22T09:00:00",
        end: "2023-06-22T17:00:00",
      },
    ];

    return { events };
  },
});
</script>
