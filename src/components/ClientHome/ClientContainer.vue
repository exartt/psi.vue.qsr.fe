<template>
  <container>
    <div class="row">
      <div class="col-6">
        <div class="column container items-center q-py-md">
          <div class="col-auto q-pb-md">
            <q-icon size="160px" color="grey" name="account_circle" />
          </div>
          <div class="col-auto full-width">
            <div class="row justify-center full-width">
              <div class="col-12 q-px-sm">
                <q-field
                  label="Nome"
                  stack-label
                  dense
                  outlined
                  readonly
                  class="q-py-sm"
                >
                  <template v-slot:control>
                    <div class="self-center no-outline" tabindex="0">
                      Leonardo Moraes
                    </div>
                  </template>
                </q-field>
                <q-field
                  label="Telefone"
                  stack-label
                  dense
                  outlined
                  readonly
                  class="q-py-sm"
                >
                  <template v-slot:control>
                    <div class="self-center no-outline" tabindex="0">
                      (43) 99999-9999
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
          </div>
        </div>
        <q-separator vertical />
      </div>
      <div class="col-6">
        <div class="row justify-center full-width">
          <div class="col-12 q-pa-sm">
            <container header="Histórico de atendimento">
              <q-table flat :rows="rows" :columns="columns" row-key="name" />
            </container>
          </div>
          <div class="col-12 q-pa-sm">
            <container header="Histórico Financeiro">
              <q-table flat :rows="rows" :columns="columns" row-key="name" />
            </container>
          </div>
        </div>
      </div>
    </div>
  </container>
</template>

<script lang="ts">
import Container from "src/components/components-structure/container.vue";
import { ref } from "vue";

export default {
  name: "ClientContainer",
  components: {
    Container,
  },
  setup() {
    const columns = ref([
      {
        name: "statusSessao",
        align: "center",
        label: "",
        field: "statusSessao",
        sortable: true,
      },
      {
        name: "dataMarcada",
        align: "center",
        label: "Data Marcada",
        field: "dataMarcada",
        sortable: true,
      },
      {
        name: "dataRemarcada",
        align: "center",
        label: "Data Remarcada",
        field: "dataRemarcada",
        sortable: true,
      },
    ]);
    return columns;
  },
};
</script>
