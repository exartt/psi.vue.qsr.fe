<template>
  <PageComponent title="Minha Agenda" subtitle="Consultar e cadastrar agendamentos de maneira visual">
    <div class="container-calendario shadow-1 q-pa-md bg-white" style="border-radius: 4px;">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mb-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        style="max-width: 600px;"
      >
        <q-tab name="scheduler" label="Agenda" />
        <q-tab name="appointments" label="Lista de consultas" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="scheduler" class="q-pa-none">
          <calendar
            v-if="!loading"
            :events="events"
            @reloadCalendar="getAppointments"
          />
       </q-tab-panel>
       <q-tab-panels name="appointments" class="q-pa-none" disabled>
        <!-- <q-table
          flat bordered
          :rows="tableTransaction || []"
          row-key="ID"
          :columns="columns"
          :filter="filter"
          :rows-per-page-options="[20]"
        >
          <template v-slot:top-right>
            <input-component v-model="startDateString" label="Data Inicial" type="date" outlined dense class="q-px-sm" />
            <input-component v-model="endDateString" label="Data Final" type="date" outlined dense class="q-px-sm" />
            <q-btn @click="filterAppointments" label="Filtrar" color="primary" dense />
          </template>
        </q-table> -->
       </q-tab-panels>
      </q-tab-panels>
    </div>
  </PageComponent>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import useApi from "src/composables/requests";
import Calendar from "src/components/components-structure/calendar.vue";
import PageComponent from "src/components/PageComponent.vue";

export default defineComponent({
  name: "ScheduleService",
  components: {
    Calendar,
    PageComponent,
  },
  setup() {
    onMounted(() => {
      getAppointments();
    });
    const schedule = "/schedule/v1";
    const events = ref([]);
    const { get } = useApi();
    const loading = ref(false);
    const tab = ref("scheduler");
    const startDateString = ref("");
    const endDateString = ref("");
    const getAppointments = async (year: number = 2023) => {
      loading.value = true;
      const url = `${schedule}/list-appointments?year=${year}`;
      const data = await get(url, false);
      events.value = data;
      console.log(data);
      loading.value = false;
    };

    const filterAppointments = async () => {
      console.log(events);
    };

    return { events, loading, getAppointments, filterAppointments, tab, startDateString, endDateString };
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
