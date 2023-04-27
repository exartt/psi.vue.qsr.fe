<template>
  <q-slide-item @left="onLeft" @right="onRight" v-if="$q.platform.is.mobile">
    <template v-slot:left>
      <q-icon name="done" />
    </template>
    <template v-slot:right>
      <q-icon name="alarm" />
    </template>
    <calendar-btn-section
      :clientName="client.name"
      :description="description"
      :summary="summary"
      :getDataInicioFimFormatada="getDataInicioFimFormatada"
      :getTimeScheduled="getTimeScheduled"/>
  </q-slide-item>
    <calendar-btn-section
      v-else
      :clientName="client.name"
      :description="description"
      :summary="summary"
      :getDataInicioFimFormatada="getDataInicioFimFormatada"
      :getTimeScheduled="getTimeScheduled"
    >
      <q-item-section side>
        <div class="row items-center">
          <q-btn icon="info" color="blue" dense flat round @click="client.id">
            <q-tooltip class="bg-blue-7">
              Abrir informações do cliente {{ client.name }}
            </q-tooltip>
          </q-btn>
          <q-btn class="q-px-sm" icon="cancel" color="red" dense round flat>
            <q-tooltip class="bg-red-7">
              Cancelar consulta.
            </q-tooltip>
          </q-btn>
          <q-btn icon="check_circle" color="green" dense round flat>
            <q-tooltip class="bg-green-7">
              Confirmar atendimento.
            </q-tooltip>
          </q-btn>
        </div>
      </q-item-section>
    </calendar-btn-section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import CalendarBtnSection from './CalendarBtnSection.vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'CalendarButton',
  components: {
    CalendarBtnSection
  },
  props: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    client: {
      type: Object,
    },
    description: {
      type: String
    },
    summary: {
      type: String
    }
  },
  setup(props) {
    const getTimeScheduled = computed<String>(() => {
      return date.formatDate(props.start, "HH:mm")
    })
    const getHour = (data: Date) => {
      return date.formatDate(data, 'HH:mm')
    }
    const getDataInicioFimFormatada = computed<String>(() => {
      return getHour(props.start) + ' - ' + getHour(props.end)
    })
    return {
      getTimeScheduled,
      getDataInicioFimFormatada
    }
  }
})
</script>
