<template>
  <q-page class="q-pa-lg">
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; gap: 32px; border-radius: 2px;" class="q-pa-md self-center bg-white shadow-1">
        <q-input v-model="startDate" label="Data de Início" type="date" style="width: 150px" />
        <q-input v-model="endDate" label="Data Final" type="date" style="width: 150px" />
        <q-btn dense @click="fetchData" :disable="startDate == null && endDate == null" label="Procurar" color="primary" style="height: fit-content; align-self: center;" />
      </div>

      <div class="q-pa-sm justify-center" style="display: flex; gap: 16px; ">
        <q-card style="width: 180px">
          <q-card-section class="q-px-md">
            <h2 class="text-h6 q-mb-md primary color-grey text-center">Lucro Bruto</h2>
            <div class="q-display-1 text-right q-mr-lg"> <span style="font-size: 16px;">R$ {{ cardsData.Brute }}</span></div>
          </q-card-section>
        </q-card>

        <q-card style="width: 180px">
          <q-card-section class="q-px-md">
            <h2 class="text-h6 q-mb-md primary color-grey text-center">Lucro Líquido</h2>
            <div class="q-display-1 text-right q-mr-lg"><span style="font-size: 16px;">R$ {{ cardsData.Liquid }}</span></div>
          </q-card-section>
        </q-card>

        <q-card style="width: 180px">
          <q-card-section class="q-px-md">
            <h2 class="text-h6 q-mb-md primary color-grey text-center">Despesas</h2>
            <div class="q-display-1 text-right q-mr-lg"><span style="font-size: 16px;">R$ {{ cardsData.Paid }}</span></div>
          </q-card-section>
        </q-card>
        <q-card style="width: 180px">
          <q-card-section class="q-px-md">
            <h2 class="text-h6 q-mb-md primary color-grey text-center">Novos Clientes</h2>
            <div class="q-display-1 text-right q-mr-lg"><span style="font-size: 16px;">{{ cardsData.NewPatients }}</span></div>
          </q-card-section>
        </q-card>
        <q-card style="width: 180px">
          <q-card-section class="q-px-md">
            <h2 class="text-h6 q-mb-md primary color-grey text-center">Atendimentos</h2>
            <div class="q-display-1 text-right q-mr-lg"><span style="font-size: 16px;">{{ cardsData.Appointments }}</span></div>
          </q-card-section>
        </q-card>
      </div>
      <div style="display: flex; align-items: center; flex-direction: column; max-width: 450px;">
        <span class="text-h4 color-grey font-noto-400 q-pb-md"> Status dos pagamentos</span>
      </div>
      <faturamento-chart v-if="renderChart" :data="fatData" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import FaturamentoChart from 'src/components/Charts/FaturamentoChart.vue';
import useApi from 'src/composables/requests';
import { defineComponent, onMounted, ref } from 'vue';

interface DashboardCards {
  Brute: number;
  Paid: number;
  Liquid: number;
  NewPatients: number;
  Appointments: number;
}

enum StatusTransaction {
  PENDING,
  PAID,
  OVERDUE,
  CANCELED,
  REFUNDED,
}

export default defineComponent({
    name: 'Dashboard',
    components: { FaturamentoChart },
    setup() {
        onMounted(() => {
            getDashCardsDataOnMount();
        });
        const cardsData = ref<DashboardCards | {
            Brute: 0;
            Paid: 0;
            Liquid: 0;
            NewPatients: 0;
            Appointments: 0;
        }>({
            Brute: 0,
            Paid: 0,
            Liquid: 0,
            NewPatients: 0,
            Appointments: 0,
        });
        const fatData = ref([]);
        const renderChart = ref(false);
        const path = "/dashboard/v1";
        const quasar = useQuasar();
        const { get } = useApi();
        const startDate = ref<string | null>(null);
        const endDate = ref<string | null>(null);
        const getDashCardsDataOnMount = () => {
            let initialDate;
            let finalDate;
            const today = new Date();
            initialDate = new Date(today.getFullYear(), today.getMonth(), 1);
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            finalDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
            getDashCardsData(initialDate, finalDate);
            getDashBoardPaymentFrequency();
        };
        const getDashBoardPaymentFrequency = async () => {
            let url = `${path}/get-status-bills`;
            quasar.loading.show();
            fatData.value = await get(url, false).then((response) => {
              response.forEach((element: any) => {
                element.Status = convertStatus(element.Status);
              });
              renderChart.value = true;
              return response;
            }).finally(() => {
                quasar.loading.hide();
            });
        };
        const getDashCardsData = async (initialDate: Date | null, finalDate: Date | null) => {
            let url = '';
            if (!initialDate && !finalDate) {
                getDashCardsDataOnMount();
            }
            if (!initialDate && finalDate) {
                url = `${path}/get-dash?dataFinal=${finalDate.toLocaleDateString()}`;
            }
            if (!finalDate && initialDate) {
                url = `${path}/get-dash?dataInicial=${initialDate.toLocaleDateString()}`;
            }
            if (initialDate && finalDate) {
                url = `${path}/get-dash?dataInicial=${initialDate.toLocaleDateString()}&dataFinal=${finalDate.toLocaleDateString()}`;
            }
            quasar.loading.show();
            cardsData.value = await get(url, false).finally(() => {
                quasar.loading.hide();
            });
        };
        const parseDate = (dateStr: string): Date => {
            const [day, month, year] = dateStr.split('/');
            return new Date(`${year}-${month}-${day}`);
        };
        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}/${month}/${year}`;
        };
        const fetchData = () => {
            const startDateAsDate = startDate.value ? parseDate(startDate.value) : null;
            const endDateAsDate = endDate.value ? parseDate(endDate.value) : null;
            getDashCardsData(startDateAsDate, endDateAsDate);
        };

        function convertStatus(status: StatusTransaction): string {
          switch (status) {
            case StatusTransaction.PENDING:
              return 'Pendente';
            case StatusTransaction.PAID:
              return 'Pago';
            case StatusTransaction.OVERDUE:
              return 'Atrasado';
            case StatusTransaction.CANCELED:
              return 'Cancelado';
            case StatusTransaction.REFUNDED:
              return 'Reembolsado';
            default:
              return 'Desconhecido';
          }
        }
        return { cardsData, startDate, endDate, fetchData, fatData, renderChart };
    }
});
</script>

<style scoped lang="scss">
  .color-grey {
    color: #777777;
  }
</style>
