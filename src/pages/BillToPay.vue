<template>
  <q-page padding>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="add" @click="openModal" />
    </q-page-sticky>
    <q-table
      flat bordered
      :rows="tableTransaction || []"
      row-key="ID"
      :columns="columns"
      :filter="filter"
      selection="multiple"
      v-model:selected="selectedRows"
    >
      <template v-slot:top>
        <q-btn class="shadow-0" color="primary" label="Adicionar despesas" @click="openModal" unelevated />
        <q-btn class="q-ml-sm shadow-0" color="secondary" :disable="selectedRows.length !== 1" label="Editar" @click="editBillToPay" unelevated />
        <q-btn class="q-ml-sm shadow-0" color="secondary" :disable="selectedRows.length === 0" label="Deletar" @click="deleteBillToPay" unelevated />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <add-bills-to @added-bill="getTableData" ref="billToPayModal" isBillToPay />
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from "quasar";
import useApi from "src/composables/requests";
import { BillToReceiveComponent } from "src/interfaces/IComponents";
import AddBillsTo from "src/components/CRCP/addBillsTo.vue"
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "BillToReceive",
  components: {
    AddBillsTo
  },
  setup() {
    onMounted(() => {
      getTableData();
    });

    const columns = [
      {
        name: 'PatientName',
        required: true,
        label: 'Nome do cliente',
        align: 'left',
        field: 'PatientName',
        format: (val: any) => `${val}`,
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
        name: 'Description',
        required: true,
        label: 'Descrição',
        align: 'left',
        field: 'Description',
      },
      {
        name: 'Status',
        required: true,
        label: 'Status',
        align: 'left',
        field: 'Status',
        format: (val: string) => formatStatus(val),
      },
    ] as any;
    const path = "/transactions/v1";
    const suffix = "-bill"
    const quasar = useQuasar();
    const { get, deletar } = useApi();
    const selectedRows = ref([]);
    const tableTransaction = ref([]);
    const billToPayModal = ref<BillToReceiveComponent | null>(null);

    const openModal = () => {
      billToPayModal.value?.open(false, null);
    };

    const closeModal = () => {
      billToPayModal.value?.close();
    };

    const formatStatus = (val: string) => {
      switch (val) {
        case 'PAID':
          return 'Pago';
        case 'OVERDUE':
          return 'Atrasado';
        case 'CANCELED':
          return 'Cancelado';
        case 'REFUNDED':
          return 'Reembolsado';
        default:
          return 'Pendente';
      }
    }

    const getTableData = async () => {
      const url = `${path}/list${suffix}?type=PAYABLE`;
      quasar.loading.show();
      tableTransaction.value = await get(url, false).finally(() => {
        quasar.loading.hide();
      });
    };

    async function editBillToPay() {
      quasar.loading.show();
      get(`${path}/get${suffix}/${(selectedRows.value[0] as any).ID}`, false).then((res) => billToPayModal.value?.open(true, res)).finally(() => {
        quasar.loading.hide();
        selectedRows.value = [];
      })
    }

    async function deleteBillToPay() {
      selectedRows.value.forEach((selected: any) => {
        return deletar(`${path}/delete${suffix}/${selected.ID}`)
      })

      getTableData();
      selectedRows.value = [];
    }


    return {
      columns,
      tableTransaction,
      filter: ref(''),
      selectedRows,
      editBillToPay,
      deleteBillToPay,
      openModal,
      closeModal,
      billToPayModal,
      getTableData
    };
  }
});
</script>
