<template>
  <q-dialog ref="dialog">
    <q-card>
      <q-card-section v-if="title">
        <div class="text-h2">{{ title }}</div>
      </q-card-section>

      <q-card-section v-if="body">
        <div>{{ body }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { QDialog } from "quasar";

export default defineComponent({
  name: "AlertCard",
  props: {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  setup() {
    const dialog = ref<QDialog | null>(null);

    const showDialog = () => {
      dialog.value?.show();
    };

    return {
      dialog,
      showDialog,
    };
  },
});
</script>
