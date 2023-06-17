<template>
  <q-select
    outlined
    color="primary"
    :filled="filled"
    v-model="internalModel"
    :dense="dense"
    :label="label"
    :options="options"
  ></q-select>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from "vue";

export type IOptions = {
  label: string | null;
  value: string | number | null;
};

export default defineComponent({
  name: "SelectCustom",
  props: {
    modelValue: {
      type: Object as () => IOptions | null,
      default: () => null,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
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
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const internalModel = computed({
      get: () => modelValue.value,
      set: (value) => {
        emit("update:modelValue", value);
        emit("change", value);
      },
    });

    return {
      internalModel,
      ...toRefs(props),
    };
  },
});
</script>
