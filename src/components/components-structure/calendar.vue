<template>
  <div class="container-calendar">
    <full-calendar class="calendar" :options="calendarOptions"></full-calendar>
    <google-auth></google-auth>
    <appointment
      ref="appointmentModal"
      @reloadCalendar="$emit('reloadCalendar')"
    />
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
import { EventType } from "@/interfaces/IUtil";
import googleAuth from "../google/googleAuth.vue";

export default defineComponent({
  components: {
    FullCalendar,
    Appointment,
    googleAuth,
  },
  props: {
    events: {
      type: Array as PropType<Array<EventType>>,
      required: true,
    },
  },
  setup(props) {
    const currentEvents = ref([]);
    const appointmentModal = ref<AppointmentModalComponet | null>(null);

    const openModal = (start: string): void => {
      appointmentModal.value?.onOpen(start);
    };

    const createSchedule = (selectInfo: any) => {
      openModal(selectInfo.startStr);
    };

    const onSelectAppointment = (clickInfo: any): void => {
      const appointmentSelected = {
        ID: clickInfo.event.id,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        description: clickInfo.event.extendedProps.description,
        location: clickInfo.event.location,
        summary: clickInfo.event.extendedProps.summary,
        status: clickInfo.event.extendedProps.status,
        notify: clickInfo.event.extendedProps.notify,
        patientID: clickInfo.event.extendedProps.patientID,
        EventID: clickInfo.event.extendedProps.EventID,
        PsychologistID: clickInfo.event.extendedProps.PsychologistID,
      };
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
        title: event.Summary,
        start: event.Start,
        end: event.End,
        location: event.Location,
        extendedProps: {
          description: event.Description,
          summary: event.Summary,
          status: event.Status,
          notify: event.Notify,
          PsychologistID: event.PsychologistID,
          patientID: event.PatientID,
          EventID: event.EventID,
          createdAt: event.CreatedAt,
          updatedAt: event.UpdatedAt,
        },
      })),
      slotMinTime: "06:00:00",
      slotMaxTime: "22:00:00",
      hiddenDays: [0],
    });

    return { calendarOptions, appointmentModal };
  },
});
</script>

<style lang="scss" scoped></style>
