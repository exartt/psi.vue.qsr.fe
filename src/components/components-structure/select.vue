<template>
  <q-select
    outlined
    color="primary"
    :filled="filled"
    v-model="internalModel"
    :dense="dense"
    :label="label"
    :options="options"
    @blur="handleBlur"
  />
</template>

<script lang="ts">
import { IOptions } from "src/interfaces/IComponents";
import { defineComponent, computed, toRefs } from "vue";

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
  emits: ["update:modelValue", "change", "blur"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const handleBlur = () => {
      emit("blur");
    };

    const internalModel = computed({
      get: () => modelValue.value,
      set: (value) => {
        emit("update:modelValue", value);
        emit("change", value);
      },
    });

    return {
      internalModel,
      handleBlur,
      ...toRefs(props),
    };
  },
});
</script>
