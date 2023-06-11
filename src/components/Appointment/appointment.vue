<template>
  <modal title="Agendar Consulta" ref="responsiveModal">
    <template #body>
      <div :class="responsiveConfig(true)">
        <select-component
          label="Selecionar paciente"
          :options="options"
          v-model="choosedTest"
        />
      </div>
      <div :class="responsiveFirstChild()">
        <datapicker-component label="Selecione uma data" v-model="dateStart" />
      </div>
      <div :class="responsiveLastChild()">
        <datapicker-component label="Selecione uma data" v-model="dateEnd" />
      </div>
      <div :class="responsiveFirstChild()">
        <input-component
          type="textarea"
          label="Descrição do agendamento"
          v-model="description"
        />
      </div>
      <div :class="responsiveLastChild()">
        <input-component
          type="textarea"
          label="Resumo do agendamento"
          v-model="summary"
        />
      </div>
    </template>
    <template #btn-section>
      <div class="col-auto q-pl-md">
        <q-btn label="Agendar" no-caps flat @click="createAppointment" />
      </div>
      <div class="col-auto q-pl-sm">
        <q-btn label="Cancelar" no-caps flat @click="close" />
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import modal from "src/components/components-structure/modal.vue";
import datapickerComponent from "src/components/components-structure/datapicker.vue";
import inputComponent from "src/components/components-structure/input.vue";
import selectComponent from "src/components/components-structure/select.vue";
import { date } from "quasar";
import { IOptions, ModalComponent } from "src/interfaces/IComponents";
import useApi from "src/composables/requests";

export default defineComponent({
  components: {
    modal,
    inputComponent,
    selectComponent,
    datapickerComponent,
  },
  setup() {
    const { get, post, error } = useApi();
    const choosedTest = ref<IOptions | null>({
      value: null,
      label: null,
    });
    const responsiveModal = ref<ModalComponent | null>(null);

    const dateStart = ref("");
    const dateEnd = ref("");
    const summary = ref("");
    const description = ref("");
    const options = [
      {
        label: "Cliente teste",
        value: 1,
      },
    ];

    const scheduleObject = () => {
      return {
        Start: convertDate(dateStart.value),
        End: convertDate(dateEnd.value),
        PsychologistID: 1,
        PatientID: choosedTest.value?.value,
        Summary: summary.value,
        Description: description.value,
        Notify: true,
      };
    };

    const createAppointment = async () => {
      const response = await post(
        "/schedule/v1/create-appointment",
        scheduleObject()
      );
    };

    const convertDate = (data: string): Date => {
      return date.extractDate(data, "YYYY/MM/DD HH:mm");
    };

    const open = (daySelected: string): void => {
      responsiveModal.value?.open();
    };

    const onEdit = (appointmentSelected: any): void => {
      console.log(appointmentSelected);
      responsiveModal.value?.open();
    };

    const close = () => {
      responsiveModal.value?.close();
    };

    const getDefaultDate = (date: String, isStart: Boolean): string => {
      if (isStart) {
        return date.replaceAll("-", "/").concat(" 06:00");
      }
      return date.replaceAll("-", "/").concat(" 07:00");
    };

    const responsiveConfig = (fullLine: boolean = false) => {
      if (fullLine) {
        return "col-12 q-pb-sm";
      }
      return "col-xs-12 col-sm-6 col-md-6 col-lg-6 q-py-sm";
    };

    const responsiveFirstChild = () => {
      return responsiveConfig() + " q-pr-md-sm";
    };

    const responsiveLastChild = () => {
      return responsiveConfig() + " q-pl-md-sm";
    };
    return {
      responsiveFirstChild,
      responsiveLastChild,
      responsiveConfig,
      responsiveModal,
      open,
      close,
      createAppointment,
      dateStart,
      dateEnd,
      summary,
      description,
      choosedTest,
      options,
      onEdit,
    };
  },
});
</script>
