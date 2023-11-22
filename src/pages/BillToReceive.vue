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
      :rows-per-page-options="[20]"
    >
      <template v-slot:top>
        <q-btn class="shadow-0" color="primary" label="Adicionar recebíveis" @click="openModal" unelevated />
        <q-btn class="q-ml-sm shadow-0" color="secondary" :disable="selectedRows.length !== 1" label="Editar" @click="editBillToReceive" unelevated />
        <q-btn class="q-ml-sm shadow-0" color="secondary" :disable="selectedRows.length === 0" label="Deletar" @click="showDeleteConfirmation" unelevated />
        <q-btn
          v-show="selectedRows.length > 0 && analisarItensSelecionados !== 3"
          class="q-ml-sm shadow-0"
          :color="analisarItensSelecionados === 1 ? 'red' : 'secondary'"
          :label="analisarItensSelecionados === 1 ? 'Remover pagamentos' : 'Confimar pagamentos'"
          @click="doSendRequest"
          unelevated
        />
        <q-space />
        <q-input outlined dense debounce="300" color="primary" v-model="filter" label="Pesquisar" class="q-pa-sm" >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-Status="props">
        <q-td :props="props">
          <q-chip
            :style="getStatusColor(props.row.Status)"
            dense
            style="padding: 4px 12px"
          >
            {{ formatStatus(props.row.Status) }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
    <add-bills-to @added-bill="getTableData" ref="billToReceiveModal" />
  </q-page>
</template>

<script lang="ts">
import { date, useQuasar } from "quasar";
import useApi from "src/composables/requests";
import { BillToReceiveComponent } from "src/interfaces/IComponents";
import AddBillsTo from "src/components/CRCP/addBillsTo.vue"
import { computed, defineComponent, onMounted, ref } from "vue";
import { useSweetAlert2 } from "src/composables/useSweetalert";

export default defineComponent({
  name: "BillToReceive",
  components: {
    AddBillsTo
  },
  setup() {
    onMounted(() => {
      getTableData();
    });
    const message = useSweetAlert2();
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
        name: 'RecordDate',
        label: 'Data final',
        align: 'left',
        field: 'RecordDate',
        format: (val: Date) => date.formatDate(val, 'DD/MM/YYYY'),
      },
      {
        name: 'Status',
        required: true,
        label: 'Status',
        align: 'center',
        field: 'Status',
      },
    ] as any;
    const path = "/transactions/v1";
    const suffix = "-bill"
    const quasar = useQuasar();
    const { get, deletar, put } = useApi();
    const selectedRows = ref([]);
    const tableTransaction = ref([]);
    const billToReceiveModal = ref<BillToReceiveComponent | null>(null);

    const analisarItensSelecionados = computed(() => {
      if (selectedRows.value.length === 0) {
        return 0;
      }

      const hasAllPaid = selectedRows.value.every((item:any) => item.Status === 'PAID');
      const hasSomePaid = selectedRows.value.some((item:any) => item.Status === 'PAID');
      const hasSomePending = selectedRows.value.some((item:any) => item.Status === 'PENDING');
      if (hasAllPaid) {
        return 1;
      } else if (hasSomePending && !hasSomePaid) {
        return 2;
      } else {
        return 3;
      }
    });

    const openModal = () => {
      billToReceiveModal.value?.open(false, null);
    };

    const closeModal = () => {
      billToReceiveModal.value?.close();
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PAID':
          return {
            background: 'green',
            color: 'white',
          };
        case 'OVERDUE':
          return {
            background: 'red',
            color: 'white',
          };
        case 'CANCELED':
          return {
            background: 'gray',
            color: 'black',
          };
        case 'REFUNDED':
          return {
            background: 'blue',
            color: 'white',
          };
        default:
          return {
            background: 'orange',
            color: 'black',
          };
      }
    }

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
      const url = `${path}/list${suffix}?type=RECEIVABLE`;
      quasar.loading.show();
      tableTransaction.value = await get(url, false).finally(() => {
        quasar.loading.hide();
      });
    };

    async function doSendRequest () {
      quasar.loading.show();
      let routeEnd = analisarItensSelecionados.value === 1 ? 'remove' : 'confirm';
      await selectedRows.value.forEach((element: any) => {
        put(`${path}/update${suffix}/${element.ID}/${routeEnd}`, {}).then(() => {
        }).finally(() => getTableData())
      });
      selectedRows.value = [];
      quasar.loading.hide();

    }

    async function editBillToReceive() {
      quasar.loading.show();
      get(`${path}/get${suffix}/${(selectedRows.value[0] as any).ID}`, false).then((res) => billToReceiveModal.value?.open(true, res)).finally(() => {
        quasar.loading.hide();
        selectedRows.value = [];
      })
    }

    async function showDeleteConfirmation() {
      const { value } = await message.fire({
        icon: 'warning',
        title: 'Deletar',
        text: 'Deseja deletar os itens selecionados? Essa ação não poderá ser revertida.',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: '#77777',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      });

      if (value) {
        deleteSelectedItems();
      }
    }

    async function deleteSelectedItems() {
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
      editBillToReceive,
      showDeleteConfirmation,
      openModal,
      doSendRequest,
      closeModal,
      billToReceiveModal,
      getTableData,
      formatStatus,
      getStatusColor,
      analisarItensSelecionados
    };
  }
});
</script>
