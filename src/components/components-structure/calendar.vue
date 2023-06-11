<template>
  <div class="container-calendar">
    <full-calendar class="calendar" :options="calendarOptions"></full-calendar>
    <appointment ref="appointmentModal"></appointment>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Appointment from "../Appointment/appointment.vue";
import { AppointmentModalComponet } from "@/interfaces/IComponents";
import useApi from "src/composables/requests";

type EventType = {
  ID: number;
  PsychologistID: number;
  PatientID: number;
  TenantID: number;
  CalendarID: string;
  Start: string;
  End: string;
  Summary: string;
  Description: string;
  Location: string;
  Status: string;
  Notify: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export default defineComponent({
  components: {
    FullCalendar,
    Appointment,
  },
  props: {
    events: {
      type: Array as PropType<Array<EventType>>,
      required: true,
    },
  },
  setup(props) {
    const { get, post, error } = useApi();

    const currentEvents = ref([]);
    const schedule = "/schedule/v1";
    const appointmentModal = ref<AppointmentModalComponet | null>(null);

    const openModal = (start: string): void => {
      appointmentModal.value?.onOpen(start);
    };

    const createSchedule = (selectInfo: any) => {
      console.log(selectInfo);
      openModal(selectInfo.startStr);
    };

    const handleWeekendsToggle = () => {
      calendarOptions.value.weekends = !calendarOptions.value.weekends;
    };

    const onSelectAppointment = (appointmentSelected: any): void => {
      appointmentModal.value?.onEdit(appointmentSelected);
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
      eventClick: onSelectAppointment,
      eventsSet: handleEvents,
      events: props.events.map((event) => ({
        id: event.ID,
        title: event.Description,
        start: event.Start,
        end: event.End,
        description: event.Description,
        location: event.Location,
        extendedProps: {
          status: event.Status,
          notify: event.Notify,
          psychologistID: event.PsychologistID,
          patientID: event.PatientID,
          tenantID: event.TenantID,
          calendarID: event.CalendarID,
          createdAt: event.CreatedAt,
          updatedAt: event.UpdatedAt,
        },
      })),
    });

    return { calendarOptions, appointmentModal };
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
