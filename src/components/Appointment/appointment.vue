<template>
  <modal title="Agendar Consulta" ref="responsiveModal">
    <template #body>
      <q-form ref="appointmentForm" class="row full-width">
        <div :class="responsiveConfig(true)">
          <select-component
            label="Selecionar paciente"
            :options="options"
            v-model="patientOption"
            @change="automaticDescription"
            :rules="[validateSelect]"
          />
        </div>
        <div :class="responsiveConfig(true)">
          <input-component
            label="Título do agendamento"
            v-model="summary"
            :rules="[validateField]"
          />
        </div>
        <div :class="responsiveFirstChild()">
          <datapicker-component
            label="Selecione uma data"
            v-model="dateStart"
          />
        </div>
        <div :class="responsiveLastChild()">
          <datapicker-component label="Selecione uma data" v-model="dateEnd" />
        </div>
        <div
          :class="responsiveConfig(true) + ' q-pb-sm'"
          style="padding-top: 8px"
        >
          <input-component
            type="textarea"
            label="Descrição do agendamento"
            v-model="description"
          />
        </div>
      </q-form>
    </template>
    <template #btn-section>
      <div class="row reverse full-width" v-if="!isEditMode">
        <div class="col-auto q-pl-md">
          <s-button
            label="Agendar"
            @click="createAppointment"
            type="primary"
            color="primary"
          />
        </div>
        <div class="col-auto q-pl-sm">
          <s-button
            label="Cancelar"
            @click="close"
            type="tertiary"
            color="secondary"
          />
        </div>
      </div>
      <div class="row justify-between full-width" v-else>
        <div class="col-auto">
          <s-button
            label="Confirmar"
            :disabled="isConfirmEnabled()"
            icon="o_check_circle"
            @click="confirmAppointment"
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
import { useSweetAlert2 } from "src/composables/useSweetalert";

export default defineComponent({
  components: {
    modal,
    inputComponent,
    selectComponent,
    datapickerComponent,
    SButton,
  },
  setup(_, { emit }) {
    const { post, put, get } = useApi();
    const appointmentForm = ref(null);
    const message = useSweetAlert2();
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
    const statusAppointment = ref<Number | 0>(0);
    const options = ref<IOptions[]>([]);

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

    const loadPatientOptions = async (): Promise<Boolean> => {
      let success = true;
      try {
        const response = await get("/patient/v1/list-patients", false);
        options.value = response;
        if (!options.value) {
          success = false;
        }
      } catch (error) {
        console.error(error);
        success = false;
      } finally {
        return success;
      }
    };

    const automaticDescription = () => {
      summary.value = `Consulta com ${patientOption.value?.label}`;
    };

    const scheduleObject = () => {
      return {
        Start: convertDate(dateStart.value),
        End: convertDate(dateEnd.value),
        PsychologistID: 1,
        PatientID: Number(patientOption.value?.value),
        Summary: summary.value,
        Description: description.value,
        EventID: storeSelected.value?.EventID,
      };
    };

    const confirmObject = (): Record<string, any> => {
      return {
        AppointmentID: Number(storeSelected.value?.ID),
        PsychologistID: Number(storeSelected.value?.PsychologistID),
        PatientID: Number(patientOption.value?.value),
        Description: description.value,
      };
    };

    const resetData = () => {
      summary.value = "";
      description.value = "";
      storeSelected.value = null;
      patientOption.value = null;
    };

    const reSchedule = (): void => {
      if (validateToSubmit()) {
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
      }
    };

    const confirmAppointment = async (): Promise<any> => {
      if (validateToSubmit()) {
        const url = `${schedule}/confirm-appointment`;
        await post(url, confirmObject()).then((response) => {
          close();
          reloadCalendar();
        });
      }
    };

    const validateToSubmit = (): Boolean => {
      let allowSubmit = true;
      let errorMessages = [];

      if (!summary.value) {
        allowSubmit = false;
        errorMessages.push("Título");
      }

      if (!patientOption.value) {
        allowSubmit = false;
        errorMessages.push("Paciente");
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

    const cancelAppointment = (): void => {
      if (validateToSubmit()) {
        const id = storeSelected.value?.ID;
        const url = `${schedule}/update-appointment/${id}/cancel-appointment`;
        put(url, scheduleObject()).then((response) => {
          reloadCalendar();
          close();
        });
      }
    };

    const createAppointment = () => {
      if (validateToSubmit()) {
        return post(`${schedule}/create-appointment`, scheduleObject())
          .then(() => {
            reloadCalendar();
            close();
          })
          .catch((error) => {
            message.fire({
              icon: "error",
              title: "Por favor, preencha todos os campos.",
            });
          });
      }
    };

    const convertDate = (data: string): Date => {
      return date.extractDate(data, "YYYY/MM/DD HH:mm");
    };

    const onOpen = async (daySelected: string): Promise<any> => {
      resetData();
      dateStart.value = getDefaultDate(daySelected, true);
      dateEnd.value = getDefaultDate(daySelected, false);
      isEditMode.value = false;
      if (await loadPatientOptions()) {
        open();
      } else {
        message.fire({
          icon: "error",
          title: "Oops",
          text: "Parece que nossos servidores estão passando por problemas técnicos, aguarde alguns instantes e tente novamente, se o problema persistir entre em contato com o suporte.",
        });
      }
    };

    const parseDate = (input: string) => {
      const parsedDate = new Date(input);
      return date.formatDate(parsedDate, "YYYY/MM/DD HH:mm");
    };

    const onEdit = async (appointmentSelected: any): Promise<any> => {
      storeSelected.value = appointmentSelected;
      dateStartMemory.value = parseDate(appointmentSelected.start);
      dateEndMemory.value = parseDate(appointmentSelected.end);
      dateStart.value = parseDate(appointmentSelected.start);
      dateEnd.value = parseDate(appointmentSelected.end);
      summary.value = appointmentSelected.summary;
      description.value = appointmentSelected.description;
      statusAppointment.value = appointmentSelected.status;

      await loadPatientOptions();

      const patient = getPatientById(appointmentSelected.patientID);
      if (patient) {
        patientOption.value = patient;
      }

      isEditMode.value = true;
      if (await loadPatientOptions()) {
        open();
      }
    };

    const getPatientById = (id: number): IOptions | undefined => {
      return options.value.find((patient) => patient.value === String(id));
    };

    const open = () => {
      responsiveModal.value?.open();
      console.log(appointmentForm.value);
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
        return "col-12";
      }
      return "col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pb-sm";
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

    const isConfirmEnabled = (): boolean => {
      return statusAppointment.value === 4 || statusAppointment.value === 3;
    };

    const validateSelect = (val: any[]): any => {
      if (val === null) {
        return "";
      }
    };

    const validateField = (val: any[]): boolean | string => {
      return (val && val.length > 0) || "";
    };

    return {
      appointmentForm,
      responsiveModal,
      dateStart,
      dateEnd,
      summary,
      description,
      patientOption,
      options,
      isEditMode,
      validateField,
      validateSelect,
      onOpen,
      close,
      responsiveFirstChild,
      responsiveLastChild,
      responsiveConfig,
      automaticDescription,
      convertDate,
      onEdit,
      createAppointment,
      cancelAppointment,
      confirmAppointment,
      reSchedule,
      isConfirmEnabled,
    };
  },
});
</script>
