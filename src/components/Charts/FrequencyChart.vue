<!-- <template>
  <line-chart :data="consultaChartData" :options="consultaChartOptions" />
</template>

<script lang="ts">
import { Line, mixins } from 'vue-chartjs';
const { reactiveData } = mixins;

export default {
  extends: Line,
  mixins: [reactiveData],
  data() {
    return {
      consultaChartData: {
        labels: ['Remarcado', 'Confirmado', 'Cancelado', 'Atendido'],
        datasets: [
          {
            label: 'Número de Consultas',
            data: [/* Preencha aqui os números correspondentes ao status */],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      consultaChartOptions: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
};
</script> -->
