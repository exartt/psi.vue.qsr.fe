<template>
  <modal title="Agendar Consulta" ref="responsiveModal">
    <template #body>
      <div :class="responsiveConfig(true)">
        <select-component
          label="Selecionar paciente"
          :options="options"
          v-model="patientOption"
          @change="automaticDescription"
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
          <s-button
            label="Desmarcar"
            @click="cancelAppointment"
            type="tertiary"
          />
        </div>
        <div class="col-auto q-pl-md">
          <s-button label="Remarcar" @click="reSchedule" type="primary" />
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import modal from "src/components/components-structure/modal.vue";
import datapickerComponent from "src/components/components-structure/datepicker.vue";
import inputComponent from "src/components/components-structure/input.vue";
import selectComponent from "src/components/components-structure/select.vue";
import { date } from "quasar";
import { IOptions, ModalComponent } from "src/interfaces/IComponents";
import useApi from "src/composables/requests";
import SButton from "../components-structure/button.vue";
import { EventType } from "src/interfaces/IUtil";
import { StatusAgendamento } from "src/enum/StatusAppointment";

export default defineComponent({
  components: {
    modal,
    inputComponent,
    selectComponent,
    datapickerComponent,
    SButton,
  },
  setup(_, { emit }) {
    const { post, put } = useApi();
    const patientOption = ref<IOptions | null>({
      value: null,
      label: null,
    });
    const responsiveModal = ref<ModalComponent | null>(null);
    const schedule = "/schedule/v1";
    const storeSelected = ref<EventType | null>(null);
    const isEditMode = ref(false);
    const dateStartMemory = ref("");
    const dateEndMemory = ref("");
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

    watch(dateStart, (newStartDate) => {
      if (newStartDate) {
        const parts = newStartDate.split(" ");
        const datePart = parts[0];
        const timeParts = parts[1].split(":");
        let hour = parseInt(timeParts[0]);
        let minute = parseInt(timeParts[1]);

        hour += 1;

        if (hour > 23) {
          hour = 0;
        }

        const newEndTime = `${datePart} ${hour
          .toString()
          .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        dateEnd.value = newEndTime;
      }
    });

    const automaticDescription = () => {
      description.value = `Consulta do ${patientOption.value?.label}`;
    };

    const scheduleObject = () => {
      return {
        Start: convertDate(dateStart.value),
        End: convertDate(dateEnd.value),
        PsychologistID: 1,
        PatientID: patientOption.value?.value,
        Summary: summary.value,
        Description: description.value,
        Notify: true,
      };
    };

    const resetData = () => {
      summary.value = "";
      description.value = "";
      storeSelected.value = null;
      patientOption.value = { value: null, label: null };
    };

    const reSchedule = (): void => {
      const id = storeSelected.value?.ID;
      let url: string = `${schedule}/update-appointment/${id}`;
      if (
        dateStartMemory.value != dateStart.value ||
        dateEndMemory.value != dateEndMemory.value
      ) {
        url = url.concat(`/status/${StatusAgendamento.Remarcado}`);
      }

      put(url, scheduleObject()).then((response) => {
        reloadCalendar();
        close();
      });
    };

    const cancelAppointment = (): void => {
      const id = storeSelected.value?.ID;
      const url = `${schedule}/update-appointment/${id}/cancel-appointment`;
      put(url, scheduleObject()).then((response) => {
        reloadCalendar();
        close();
      });
    };

    const createAppointment = async () => {
      const response = await post(
        "/schedule/v1/create-appointment",
        scheduleObject()
      ).then(() => {
        reloadCalendar();
        close();
      });
      console.log(response);
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

      dateStartMemory.value = parseDate(appointmentSelected.start);
      dateEndMemory.value = parseDate(appointmentSelected.end);
      dateStart.value = parseDate(appointmentSelected.start);
      dateEnd.value = parseDate(appointmentSelected.end);
      summary.value = appointmentSelected.summary;
      description.value = appointmentSelected.description;
      console.log("abriu", dateEnd.value);
      const patient = getPatientById(appointmentSelected.patientID);
      if (patient) {
        patientOption.value = patient;
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

    const reloadCalendar = (): void => {
      emit("reloadCalendar");
    };

    return {
      responsiveModal,
      dateStart,
      dateEnd,
      summary,
      description,
      patientOption,
      options,
      isEditMode,
      onOpen,
      close,
      createAppointment,
      responsiveFirstChild,
      responsiveLastChild,
      responsiveConfig,
      onEdit,
      cancelAppointment,
      reSchedule,
      automaticDescription,
      convertDate,
    };
  },
});
</script>
