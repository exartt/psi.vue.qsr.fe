<template>
  <PageComponent title="Meu Fluxo de Caixa" subtitle="Visão Integral das Transações Financeiras: Registro Preciso de Pagamentos e Recebíveis para uma Análise Abrangente do Fluxo de Caixa">
    <q-table
      flat bordered
      :rows="tableTransaction || []"
      row-key="ID"
      :columns="columns"
      :filter="filter"
      :rows-per-page-options="[20]"
    >
      <template v-slot:top-right>
        <input-component v-model="startDateString" label="Data Inicial" type="date" outlined dense class="q-px-sm" />
        <input-component v-model="endDateString" label="Data Final" type="date" outlined dense class="q-px-sm" />
        <q-btn @click="filteredTransactions" label="Filtrar" color="primary" dense />
      </template>
    </q-table>
  </PageComponent>
</template>

<script lang="ts">
import { date, useQuasar } from "quasar";
import useApi from "src/composables/requests";
import { defineComponent, onMounted, ref } from "vue";
import InputComponent from 'src/components/components-structure/input.vue';
import PageComponent from "src/components/PageComponent.vue";

export default defineComponent({
  name: "CashFlow",
  components: {
    InputComponent,
    PageComponent
  },
  setup() {
    const startDateString = ref<string | undefined>(undefined);
    const endDateString = ref<string | undefined>(undefined);
    const originalTableData = ref([]);
    onMounted(() => {
      getTableData();
    });
    const columns = [
      {
        name: 'Description',
        required: true,
        label: 'Descrição',
        align: 'left',
        field: 'Description',
      },
      {
        name: 'Value',
        required: true,
        label: 'Valor',
        align: 'left',
        field: 'Value',
        format: (val: Number) => `R$ ${val.toFixed(2)}`,
      },
      {
        name: 'TransactionType',
        required: true,
        label: 'Tipo do faturamento',
        align: 'left',
        field: 'TransactionType',
        format: (val: string) => val === 'RECEIVABLE' ? 'Recebimento' : 'Pagamento'
      },
      {
        name: 'UpdatedAt',
        label: 'Data Realizada',
        align: 'left',
        field: 'UpdatedAt',
        format: (val: Date) => date.formatDate(val, 'DD/MM/YYYY'),
      },
    ] as any;
    const path = "/transactions/v1";
    const suffix = "-cash-flow"
    const quasar = useQuasar();
    const { get } = useApi();
    const tableTransaction = ref([]);

    const getTableData = async () => {
      const url = `${path}/list${suffix}`;
      quasar.loading.show();
      tableTransaction.value = await get(url, false).finally(() => {
        quasar.loading.hide();
      });
      originalTableData.value = tableTransaction.value;
    };

    const filteredTransactions = () => {
      const startDate = startDateString.value ? new Date(startDateString.value) : null;
      const endDate = endDateString.value ? new Date(endDateString.value) : null;

      if (!startDate && !endDate) {
        tableTransaction.value = originalTableData.value;
        return;
      }

      tableTransaction.value = originalTableData.value.filter((transaction: any) => {
        const transactionDate = new Date(transaction.UpdatedAt);
        if (startDate && endDate) {
          return transactionDate >= startDate && transactionDate <= endDate;
        } else if (startDate) {
          return transactionDate >= startDate;
        } else if (endDate) {
          return transactionDate <= endDate;
        }

        return true;
      });
    };

    return {
      columns,
      startDateString,
      endDateString,
      tableTransaction,
      filter: ref(''),
      getTableData,
      filteredTransactions
    };
  }
});
</script>
