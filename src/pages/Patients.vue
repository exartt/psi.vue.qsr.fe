<template>
  <q-page padding>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="add" @click="openPatient" />
    </q-page-sticky>
    <q-table
      flat bordered
      :rows="tablePatient || []"
      row-key="ID"
      :columns="columns"
      :filter="filter"
      selection="multiple"
      v-model:selected="selectedRows"
    >
      <template v-slot:top>
        <q-btn class="shadow-0" color="primary" label="Adicionar Paciente" @click="openPatient" unelevated />
        <q-btn class="q-ml-sm shadow-0" color="secondary" :disable="selectedRows.length !== 1" label="Editar" @click="editPatient" unelevated />
        <q-btn class="q-ml-sm shadow-0" color="secondary" :disable="selectedRows.length === 0" label="Deletar" @click="deletePatient" unelevated />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <add-patient @added-person="getTableData" ref="patientModal" />
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from "quasar";
import useApi from "src/composables/requests";
import { PatientComponent } from "src/interfaces/IComponents";
import AddPatient from "src/components/Persons/addPatient.vue"
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "Patients",
  components: {
    AddPatient
  },
  setup() {
    onMounted(() => {
      getTableData();
    });

    const columns = [
      { name: "Name", label: "Nome", field: (row: { Name: string; }) => row.Name, align: 'left' },
      { name: "Email", label: "Email", field: (row: { Email: string; }) => row.Email, align: 'left' },
    ] as any;
    const path = "/patient/v1";
    const quasar = useQuasar();
    const { get, deletar } = useApi();
    const selectedRows = ref([]);
    const tablePatient = ref([]);
    const patientModal = ref<PatientComponent | null>(null);

    const openPatient = () => {
      patientModal.value?.open(false, null);
    };

    const closeModal = () => {
      console.log('close')
      patientModal.value?.close();
    };

    const getTableData = async () => {
      const url = `${path}/list-person-patient`;
      quasar.loading.show();
      tablePatient.value = await get(url, false).finally(() => {
        quasar.loading.hide();
      });
      console.log(tablePatient.value)
    };

    async function editPatient() {
      quasar.loading.show();
      get(`${path}/get-patient/${(selectedRows.value[0] as any).ID}`, false).then((res) => patientModal.value?.open(true, res)).finally(() => {
        quasar.loading.hide();
      })
    }

    function deletePatient() {
      const ids = selectedRows.value.join(',');
      deletar(`${path}/delete-patient?id=${ids}`).then(() => {
        getTableData();
      });
    }


    return {
      columns,
      tablePatient,
      filter: ref(''),
      selectedRows,
      editPatient,
      deletePatient,
      openPatient,
      closeModal,
      patientModal,
      getTableData
    };
  }
});
</script>
