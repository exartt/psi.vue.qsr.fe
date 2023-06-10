<template>
  <div class="container-calendar">
    <full-calendar class="calendar" :options="calendarOptions"></full-calendar>
    <responsive-modal ref="responsiveModal"></responsive-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ResponsiveModal from "./modal.vue";
import { ModalComponent } from "@/interfaces/IComponents";

export default defineComponent({
  components: {
    FullCalendar,
    ResponsiveModal,
  },
  props: {
    events: {
      type: Array as PropType<
        Array<{ title: string; start: string; end?: string }>
      >,
      required: true,
    },
  },
  setup(props) {
    const currentEvents = ref([]);
    const responsiveModal = ref<ModalComponent | null>(null);

    const handleWeekendsToggle = () => {
      calendarOptions.value.weekends = !calendarOptions.value.weekends;
    };

    const createSchedule = (selectInfo: any) => {
      openModal();
    };

    const openModal = () => {
      responsiveModal.value?.open();
    };

    const openSchedule = (clickInfo: any) => {
      if (
        confirm(
          `Are you sure you want to delete the event '${clickInfo.event.title}'`
        )
      ) {
        clickInfo.event.remove();
      }
    };

    const handleEvents = (events: any) => {
      currentEvents.value = events;
    };

    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      buttonText: {
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Dia",
      },
      locale: "pt-br",
      allDaySlot: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      select: createSchedule,
      eventClick: openSchedule,
      eventsSet: handleEvents,
      events: props.events,
    });

    return { calendarOptions, responsiveModal };
  },
});
</script>

<style lang="scss" scoped>
.fc {
  >>> table {
    background: red;
  }
  >>> .fc-view-harness .fc-view > table {
    background: blue;
  }
}
</style>
