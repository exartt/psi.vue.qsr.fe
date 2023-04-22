<template>
  <div class="column">
    <calendar-button
      v-for="(teste, index) in testes"
      :key="index"
      :start="teste.start.dateTime"
      :end="teste.end.dateTime"
      :clientName="teste.cliente.name"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CalendarLayout',
  setup() {
    return {
      testes: [
        {
          "start": {
            "dateTime": "2023-05-15T10:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "end": {
            "dateTime": "2023-05-15T11:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "summary": "Reunião com Cliente A",
          "location": "Clínica X",
          "description": "Discutir planos futuros",
          "cliente": {"name": "Cliente A"},
          "reminders": {
            "useDefault": true
          }
        },
        {
          "start": {
            "dateTime": "2023-05-15T12:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "end": {
            "dateTime": "2023-05-15T13:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "summary": "Apresentação de Proposta para Cliente B",
          "location": "Clínica X",
          "description": "Apresentar soluções personalizadas",
          "cliente": {"name": "Cliente B"},
          "reminders": {
            "useDefault": true
          }
        },
        {
          "start": {
            "dateTime": "2023-05-15T14:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "end": {
            "dateTime": "2023-05-15T15:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "summary": "Acompanhamento de Cliente C",
          "location": "Clínica X",
          "description": "Acompanhar progresso do tratamento",
          "cliente": {"name": "Cliente C"},
          "reminders": {
            "useDefault": true
          }
        },
        {
          "start": {
            "dateTime": "2023-05-15T16:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "end": {
            "dateTime": "2023-05-15T17:00:00-03:00",
            "timeZone": "America/Sao_Paulo"
          },
          "summary": "Consulta com Cliente D",
          "location": "Clínica X",
          "description": "Realizar avaliação e diagnóstico",
          "cliente": {"name": "Cliente D"},
          "reminders": {
            "useDefault": true
          }
        }
      ]
    }
  }
})
</script>
