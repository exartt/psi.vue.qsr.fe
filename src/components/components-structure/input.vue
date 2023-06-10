<template>
  <q-input
    outlined
    color="primary"
    :filled="filled"
    v-model="internalModel"
    :dense="dense"
    :label="label"
  ></q-input>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from "vue";

export default defineComponent({
  name: "InputCustom",
  props: {
    modelValue: String,
    label: {
      type: String,
      required: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    filled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const internalModel = computed({
      get: () => modelValue.value,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      internalModel,
      ...toRefs(props),
    };
  },
});
</script>
