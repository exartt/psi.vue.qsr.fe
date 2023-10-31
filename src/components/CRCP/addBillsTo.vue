<template>
  <Modal title="Adicionar Transação" ref="responsiveModal">
    <template #body>
      <q-form ref="addTransactionForm" class="row full-width">
        <div v-if="!isBillToPay" :class="responsiveConfig(true)">
          <select-component
            :label="editMode ? 'Paciente' : 'Selecionar paciente'"
            :options="options"
            v-model="patientOption"
            @change="val => automaticChangesWhenSelect(val.session_price)"
            :rules="[validateSelect]"
            :disabled="editMode"
            :readonly="editMode"
          />
        </div>
        <input-component
          :label="isBillToPay ? 'Valor da despesa' : 'Valor a receber'"
          :class="responsiveConfig(true)"
          v-model="valueInput"
          mask="#"
          fill-mask="0"
          reverse-fill-mask
          :rules="[val => !!val || 'Valor é obrigatório']"
        />
        <input-component
          :class="responsiveConfig()"
          label="Descrição"
          v-model="transaction.Description"
          :rules="[val => !!val || 'A descrição é obrigatória']"
        />
        <div class="flex items-center no-wrap q-py-sm full-width">
          <q-input dense filled v-model="transaction.RecordDate" mask="date" :rules="['date']" style="width: 100%;" label="Data para pagamento">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="transaction.RecordDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-form>
    </template>
    <template #btn-section>
      <div style="display: flex; justify-content: space-between;">
        <div v-if="editMode">
          <s-button label="Pagamento realizado" @click="close()" type="tertiary" />
        </div>
        <div>
          <s-button label="Fechar" @click="close()" type="tertiary" />
          <s-button :label="editMode ? 'Editar' : 'Adicionar'" @click="persistTransaction" type="primary" />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Modal from "src/components/components-structure/modal.vue";
import { IOptions, ModalComponent } from 'src/interfaces/IComponents';
import InputComponent from 'src/components/components-structure/input.vue';
import SButton from 'src/components/components-structure/button.vue';
import useApi from 'src/composables/requests';
import { useSweetAlert2 } from 'src/composables/useSweetalert';
import { date, useQuasar } from 'quasar';
import SelectComponent from 'src/components/components-structure/select.vue';

type BillTo = { ID: number, PatientID: number; TransactionType: string; Value: number; Description: string; RecordDate: Date; AppointmentID: number; PatientName: string; };

export default defineComponent({
  components: {
    Modal,
    SButton,
    InputComponent,
    SelectComponent
  },
  props: {
    isBillToPay: {
      type: Boolean,
    }
  },
  setup(props, { emit }) {

    const valueInput = computed({
      get: () => transaction.value.Value.toString(),
      set: (value) => {
        const numericValue = parseFloat(value);
        transaction.value.Value = isNaN(numericValue) ? 0 : numericValue;
      },
    });

    const { post, put, get } = useApi();
    const responsiveModal = ref<ModalComponent | null>(null);
    const message = useSweetAlert2();
    const path = ref("/transactions/v1");
    const suffix = "-bill";
    const options = ref<IOptions[]>([]);
    const quasar = useQuasar();
    const proxyDate = ref(date.formatDate(date.addToDate(new Date(), { months: 1 }), 'YYYY/MM/DD'));
    const transaction = ref({
      ID: 0,
      PatientID: 0,
      TransactionType: 'RECEIVABLE',
      Value: 140,
      Description: '',
      RecordDate: date.formatDate(date.addToDate(new Date(), { months: 1 }), 'YYYY/MM/DD'),
      AppointmentID: 0
    });
    const patientOption = ref<IOptions | null>({
      value: null,
      label: null,
    });

    const loadPatientOptions = async (): Promise<Boolean> => {
      let success = true;
      try {
        const response = await get(`/patient/v1/list-patients`, false).then();
        options.value = response;
        if (!options.value) {
          success = false;
        }
        if (editMode.value) {
          patientOption.value = options.value.find((option) => Number(option.value) == transaction.value.PatientID) || null;
        }
      } catch (error) {
        console.error(error);
        success = false;
      } finally {
        return success;
      }
    };

    const dataFormatadaRule = (val: any[]): any => {
      return [
        (v:any) => {
          const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
          if (datePattern.test(v)) {
            const parts = v.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            if (
              month >= 1 &&
              month <= 12 &&
              day >= 1 &&
              day <= new Date(year, month, 0).getDate()
            ) {
              return true;
            }
          }
          return 'Formato de data inválido (dd/mm/yyyy)';
        },
      ];
    };

    const updateProxy = () => {
      proxyDate.value = transaction.value.RecordDate
    }

    const save = () => {
      transaction.value.RecordDate = proxyDate.value
    }

    const responsiveConfig = (fullLine = false) => {
      if (fullLine) {
        return "col-12";
      }
      return "col-12 q-pb-md";
    };

    const validateToSubmit = () => {
      let allowSubmit = true;
      let errorMessages = [];

      if (!transaction.value.TransactionType) {
        allowSubmit = false;
        errorMessages.push("Tipo de Transação");
      }
      if (!props.isBillToPay && !patientOption.value) {
        allowSubmit = false;
        errorMessages.push("Paciente");
      }
      if (!transaction.value.Description) {
        allowSubmit = false;
        errorMessages.push("Descrição");
      }
      if (!transaction.value.Value) {
        allowSubmit = false;
        errorMessages.push("Valor");
      }

      if (!allowSubmit) {
        message.fire({
          icon: "warning",
          title: "Informações necessárias",
          html:
            errorMessages.length > 1
              ? "Por favor, preencha os campos:<br><br>" +
                errorMessages.map((msg) => `${msg}<br>`).join("")
              : `Por favor, preencha o campo ${errorMessages[0]}`,
        });
      }
      return allowSubmit;
    };

    const resetFields = () => {
      transaction.value = {
        ID: 0,
        PatientID: 0,
        TransactionType: 'RECEIVABLE',
        Value: 140,
        Description: '',
        RecordDate: date.formatDate(date.addToDate(new Date(), { months: 1 }), 'YYYY/MM/DD'),
        AppointmentID: 0
      };
      patientOption.value = null;
    };

    const automaticChangesWhenSelect = (val: number) => {
      transaction.value.Description = `Valor referente a consulta com ${patientOption.value?.label}`;
      transaction.value.Value = val;
    };

    const editMode = ref(false);

    const open = async (isEdit = false, object: any ) => {
      resetFields();
      if (props.isBillToPay) {
        transaction.value.TransactionType = 'PAYABLE';
        transaction.value.Value = 140;
        path.value = "/bill-to-pay/v1";
      }

      if (isEdit) {
        transaction.value = object;
        editMode.value = true;
      }
      quasar.loading.show({message: "Carregando..."});
      await loadPatientOptions().finally(() => {
        quasar.loading.hide();
      });

      responsiveModal.value?.open();
    };

    const close = () => {
      responsiveModal.value?.close();
    };

    const validateSelect = (val: any[]): any => {
      if (val === null) {
        return "";
      }
    };

    const persistTransaction = () => {
      if (editMode.value) {
        editTransaction();
        return;
      }
      if (validateToSubmit()) {
        let objTransaction = transaction.value;
        console.log(transaction.value)
        if (!props.isBillToPay) {
          objTransaction = { ...transaction.value, PatientID: Number(patientOption.value?.value)};
        }
        return post(`${path.value}/create${suffix}`, {...objTransaction, Value: Number(transaction.value.Value)})
          .then((response) => {
            emit(`added${suffix}`, transaction.value);
            close();
          })
          .catch((error) => {
            message.fire({
              icon: "error",
              title: `Erro ${error.response.status}`,
              text: error.response.data,
            });
          });
      }
    };

    const editTransaction = () => {
      if (validateToSubmit()) {
        return put(`${path.value}/update${suffix}/`, transaction.value)
          .then((response) => {
            emit(`added${suffix}`, transaction.value);
            close();
          })
          .catch((error) => {
            message.fire({
              icon: "error",
              title: `Erro ${error.response.status}`,
              text: error.response.data,
            });
          });
      }
    };


    return {
      props,
      options,
      editMode,
      proxyDate,
      valueInput,
      transaction,
      patientOption,
      responsiveModal,
      automaticChangesWhenSelect,
      persistTransaction,
      dataFormatadaRule,
      responsiveConfig,
      validateSelect,
      updateProxy,
      close,
      open,
      save,
    };
  },
});
</script>
