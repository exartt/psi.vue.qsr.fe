<template>
  <q-dialog ref="dialog">
    <q-card class="alert-container q-pt-md">
      <div class="column">
        <div class="self-center">
          <q-icon :name="typeUsed" :color="colorIcon" size="64px" />
        </div>
        <span :class="'text-center q-pb-sm text-title ' + typeUsed">{{
          title
        }}</span>
        <q-separator />
        <span
          class="text-color q-py-md q-px-md text-body2 text-center"
          v-if="message"
          >{{ message }}</span
        >
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { QDialog } from "quasar";
import { alert } from "./enum/alertCardEnum";
export default defineComponent({
  name: "AlertCard",
  setup() {
    const dialog = ref<QDialog | null>(null);
    const title = ref<string>("");
    const message = ref<string | null>("");
    const type = ref<alert>(alert.ERROR);

    const showAlert = (
      msg: string | null,
      header: string,
      alertType: alert
    ) => {
      title.value = header;
      msg ? (message.value = msg) : (message.value = null);
      type.value = alertType;
      showDialog();
    };

    const showError = (header = "Erro!", msg: string | null) => {
      showAlert(msg, header, alert.ERROR);
    };

    const showWarning = (header = "Atenção!", msg: string | null) => {
      showAlert(msg, header, alert.WARNING);
    };

    const showDialog = () => {
      dialog.value?.show();
    };

    return {
      dialog,
      title,
      message,
      type,
      showError,
      showWarning,
      showDialog,
      typeUsed: computed(() => {
        return type.value === alert.ERROR ? "error" : "warning";
      }),
      colorIcon: computed(() => {
        return type.value === alert.ERROR ? "red" : "orange";
      }),
    };
  },
});
</script>

<style scoped>
.alert-container {
  width: 250px;
}

.text-title {
  font-size: 28px;
}

.alert-container .error {
  color: red;
}

.alert-container .warning {
  color: orange;
}

.alert-container .text-color {
  color: #2e2e2e;
}
</style>
