<template>
    <Responsive class="w-full" style="max-width: 450px;">
      <template #main="{ width }">
        <Chart
          direction="circular"
          :size="{ width, height: 400 }"
          :data="data"
          :margin="{
            left: Math.round((width - 360)/2),
            top: 20,
            right: 0,
            bottom: 20
          }"
          :axis="axis"
          :config="{ controlHover: false }"
          >
          <template #layers>
            <Pie
              :dataKeys="['Status', 'Count']"
              :pie-style="{ innerRadius: 100, padAngle: 0.05 }" />
          </template>
          <template #widgets>
            <Tooltip
              :config="{
                name: { },
                avg: { hide: true},
                pl: { label: 'value' },
                inc: { hide: true }
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
    const dataToUse = ref(props.data);

    return {
      dataToUse
    };
  },
})
</script>
