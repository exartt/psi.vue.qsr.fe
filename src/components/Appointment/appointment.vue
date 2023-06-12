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
      <div class="row reverse" v-if="!isEditMode">
        <div class="col-auto q-pl-md">
          <s-button label="Agendar" @click="createAppointment" type="primary" />
        </div>
        <div class="col-auto q-pl-sm">
          <s-button label="Cancelar" @click="close" type="tertiary" />
        </div>
      </div>
      <div class="row justify-between full-width" v-else>
        <div class="col-auto">
          <s-button
            label="Confirmar"
            icon="o_check_circle"
            @click="close"
            type="secondary"
          />
        </div>
        <q-space />
        <div class="col-auto q-pl-sm">
          <s-button label="Desmarcar" @click="close" type="tertiary" />
        </div>
        <div class="col-auto q-pl-md">
          <s-button
            label="Remarcar"
            @click="createAppointment"
            type="primary"
          />
        </div>
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
import SButton from "../components-structure/button.vue";
import { EventType } from "@/interfaces/IUtil";

export default defineComponent({
  components: {
    modal,
    inputComponent,
    selectComponent,
    datapickerComponent,
    SButton,
  },
  setup() {
    const { get, post, error } = useApi();
    const choosedTest = ref<IOptions | null>({
      value: null,
      label: null,
    });
    const responsiveModal = ref<ModalComponent | null>(null);

    const storeSelected = ref<EventType | null>(null);
    const isEditMode = ref(false);
    const dateStart = ref("");
    const dateEnd = ref("");
    const summary = ref("");
    const description = ref("");
    const options: IOptions[] = [
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

    const resetData = () => {
      summary.value = "";
      description.value = "";
      storeSelected.value = null;
      choosedTest.value = { value: null, label: null };
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

    const onOpen = (daySelected: string): void => {
      resetData();
      dateStart.value = getDefaultDate(daySelected, true);
      dateEnd.value = getDefaultDate(daySelected, false);
      isEditMode.value = false;
      responsiveModal.value?.open();
    };

    const parseDate = (input: string) => {
      const parsedDate = new Date(input);
      return date.formatDate(parsedDate, "YYYY/MM/DD HH:mm");
    };

    const onEdit = (appointmentSelected: any): void => {
      storeSelected.value = appointmentSelected;

      dateStart.value = parseDate(appointmentSelected.start);
      dateEnd.value = parseDate(appointmentSelected.end);
      summary.value = appointmentSelected.summary;
      description.value = appointmentSelected.description;
      const patient = getPatientById(appointmentSelected.patientID);
      if (patient) {
        choosedTest.value = patient;
      }
      isEditMode.value = true;
      responsiveModal.value?.open();
    };

    const getPatientById = (id: number): IOptions | undefined => {
      return options.find((patient) => patient.value === id);
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
      onOpen,
      close,
      createAppointment,
      dateStart,
      dateEnd,
      summary,
      description,
      choosedTest,
      options,
      onEdit,
      isEditMode,
    };
  },
});
</script>
