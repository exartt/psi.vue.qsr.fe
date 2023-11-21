<template>
  <Responsive class="w-full">
    <template #main="{ width }">
      <Chart
        direction="circular"
        :size="{ width, height: 400 }"
        :data="statusData"
        :margin="{
          left: Math.round((width - 360)/2),
          top: 20,
          right: 0,
          bottom: 20
        }"
        :axis="(axis)"
        :config="{ controlHover: false }"

      >
        <template #layers>
          <Pie
            :dataKeys="['Status', 'Count']"
            :pie-style="{ innerRadius: 100, padAngle: 0.05 }"
          />
        </template>
        <template #widgets>
          <Tooltip
            :config="{
              status: { label: 'Status' },
              count: { label: 'Count' },
            }"
            hideLine
          />
        </template>
      </Chart>
    </template>
  </Responsive>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'
import { ChartAxis } from 'vue3-charts/dist/types'

export default defineComponent({
  name: 'PieChart',
  components: { Chart, Responsive, Pie, Tooltip },
  props: {
    data: {
      type: Array,
      required: true,
      default: []
    },
  },
  setup(props) {
    const statusData = ref(props.data) as any

    const axis = ref({
      primary: {
        type: 'band',
        format: (val: string) => val,
      },
      secondary: {
        type: 'linear',
        ticks: 8,
      },
    } as ChartAxis)

    return { statusData, axis }
  },
})
</script>
