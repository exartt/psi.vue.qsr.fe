<template>
  <container header="Consultas">
    <div class="row" style="width: 100%; height: 100%">
      <div class="col-12">
        <calendar-button
          v-for="(teste, index) in testes"
          :key="index"
          :start="teste.start.dateTime"
          :end="teste.end.dateTime"
          :client="teste.cliente"
          :description="teste.description"
          :summary="teste.summary"
          class="q-mb-xs consulta-scheduled bg-white"
        />
      </div>
    </div>
  </container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CalendarButton from "./CalendarButton.vue";
import Container from "src/components/components-structure/container.vue";

export default defineComponent({
  name: "CalendarLayout",
  components: {
    CalendarButton,
    Container,
  },
  setup() {
    return {
      testes: [
        {
          start: {
            dateTime: new Date("2023-05-15T10:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: new Date("2023-05-15T11:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          summary: "Reunião com Cliente A",
          location: "Clínica X",
          description: "Discutir planos futuros",
          cliente: { name: "Cliente A" },
          reminders: {
            useDefault: true,
          },
        },
        {
          start: {
            dateTime: new Date("2023-05-15T12:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: new Date("2023-05-15T13:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          location: "Clínica X",
          cliente: { name: "Cliente B" },
          reminders: {
            useDefault: true,
          },
        },
        {
          start: {
            dateTime: new Date("2023-05-15T14:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: new Date("2023-05-15T15:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          summary: "Acompanhamento de Cliente C",
          location: "Clínica X",
          description:
            "Acompanhar progresso do tratamentoAcompanhar progresso do tratamentoAcompanhar progresso do tratamentoAcompanhar progresso do tratamentoAcompanhar progresso do tratamento",
          cliente: { name: "Cliente C" },
          reminders: {
            useDefault: true,
          },
        },
        {
          start: {
            dateTime: new Date("2023-05-15T16:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: new Date("2023-05-15T17:00:00-03:00"),
            timeZone: "America/Sao_Paulo",
          },
          summary: "Consulta com Cliente D",
          location: "Clínica X",
          description: "Realizar avaliação e diagnóstico",
          cliente: { name: "Cliente D" },
          reminders: {
            useDefault: true,
          },
        },
      ],
    };
  },
});
</script>

<style scoped>
.consulta-scheduled {
  border: 0.5px solid #2c3e50;
  border-radius: 10px;
}
</style>
