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
            label="Paciente"
            :options="options"
            v-model="choosedTest"
          />
        </div>
        <div :class="responsiveConfig()">
          <datapicker-component></datapicker-component>
        </div>
        <div :class="responsiveConfig()">
          <datapicker-component></datapicker-component>
        </div>
        <div :class="responsiveConfig()">
          <input-component label="Descrição"></input-component>
        </div>
        <div :class="responsiveConfig()">
          <input-component label="Resumo"></input-component>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import datapickerComponent from "./datapicker.vue";
import inputComponent from "./input.vue";
import selectComponent from "./select.vue";

export default defineComponent({
  name: "ResponsiveModal",
  components: {
    inputComponent,
    selectComponent,
    datapickerComponent,
  },
  setup(_, { emit }) {
    const isOpened = ref(false);
    const choosedTest = ref(null);
    const options = [
      {
        label: "Google",
        value: "Google",
        description: "Search engine",
        category: "1",
      },
      {
        label: "Facebook",
        value: "Facebook",
        description: "Social media",
        category: "1",
      },
      {
        label: "Twitter",
        value: "Twitter",
        description: "Quick updates",
        category: "2",
      },
      {
        label: "Apple",
        value: "Apple",
        description: "iStuff",
        category: "2",
      },
      {
        label: "Oracle",
        value: "Oracle",
        disable: true,
        description: "Databases",
        category: "3",
      },
    ];
    const open = () => {
      console.log("open Modal");
      isOpened.value = true;
    };

    const close = () => {
      isOpened.value = false;
    };

    const responsiveConfig = (fullLine: boolean = false) => {
      if (fullLine) {
        return 'col-12 q-py-xs-sm q-px-xs-md q-pa-md-md"';
      }
      return 'col-xs-12 col-sm-6 col-md-6 col-lg-6 q-py-xs-sm q-px-xs-md q-pa-md-md"';
    };

    return {
      options,
      choosedTest,
      isOpened,
      open,
      close,
      responsiveConfig,
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
