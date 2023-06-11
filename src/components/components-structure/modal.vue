<template>
  <q-dialog v-model="isOpened" v-bind="$attrs" ref="modalComponent">
    <div class="row container-modal bg-white">
      <div class="row header-modal q-pa-md justify-between full-width">
        <span class="text-h5">Agendar Consulta</span>
        <q-btn flat>Fechar</q-btn>
      </div>
      <div class="row line full-width q-mb-xs-sm"></div>
      <div class="row full-width">
        <div :class="responsiveConfig(true)">
          <select-component
            label="Selecionar paciente"
            :options="options"
            v-model="choosedTest"
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
      </div>
      <div class="row full-width q-pa-md reverse">
        <div class="col-auto q-pl-md">
          <q-btn label="Agendar" no-caps flat @click="createAppointment" />
        </div>
        <div class="col-auto q-pl-sm">
          <q-btn label="Cancelar" no-caps flat @click="close" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>


<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from "vue";
import datapickerComponent from "./datapicker.vue";
import inputComponent from "./input.vue";
import selectComponent from "./select.vue";
import { date } from "quasar";
import { useQuasar } from "quasar";

interface IOptions {
  label: string;
  value: string | number;
}

export default defineComponent({
  name: "ResponsiveModal",
  components: {
    inputComponent,
    selectComponent,
    datapickerComponent,
  },
  setup(_, { emit }) {
    const $q = useQuasar();
    const isOpened = ref(false);
    const choosedTest = ref<IOptions | null>(null);
    const dateStart = ref("");
    const dateEnd = ref("");
    const summary = ref("");
    const description = ref("");
    const internalInstance = getCurrentInstance();
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
      try {
        $q.loading.show();

        await internalInstance?.appContext.config.globalProperties.$gateway.post(
          "/schedule/v1/create-appointment",
          scheduleObject()
        );

        console.log("Agendamento criado com sucesso!");
      } catch (error) {
        console.log("Erro ao criar agendamento:", error);
      } finally {
        $q.loading.hide();
      }
    };

    const convertDate = (data: string): Date => {
      return date.extractDate(data, "YYYY/MM/DD HH:mm");
    };

    const open = (daySelected: string) => {
      dateStart.value = getDefaultDate(daySelected, true);
      dateEnd.value = getDefaultDate(daySelected, false);
      isOpened.value = true;
    };

    const close = () => {
      isOpened.value = false;
    };

    const getDefaultDate = (date: String, isStart: Boolean): string => {
      if (isStart) {
        return date.replaceAll("-", "/").concat(" 06:00");
      }
      return date.replaceAll("-", "/").concat(" 07:00");
    };

    const responsiveConfig = (fullLine: boolean = false) => {
      if (fullLine) {
        return 'col-12 q-py-xs-sm q-px-xs-md q-pa-md-md"';
      }
      return "col-xs-12 col-sm-6 col-md-6 col-lg-6 q-py-xs-sm q-px-xs-md q-py-md-md";
    };

    const responsiveFirstChild = () => {
      return responsiveConfig() + "q-pl-md-md q-pr-md-sm";
    };

    const responsiveLastChild = () => {
      return responsiveConfig() + "q-pl-mr-md q-pl-md-sm";
    };

    return {
      summary,
      description,
      dateStart,
      dateEnd,
      options,
      choosedTest,
      isOpened,
      open,
      close,
      responsiveConfig,
      responsiveFirstChild,
      responsiveLastChild,
      createAppointment,
    };
  },
});
</script>

<style lang="scss" scoped>
.container-modal {
  .line {
    border-bottom: 1px solid $border-color;
  }
}
</style>
