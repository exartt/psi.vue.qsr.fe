<template>
  <q-btn
    :class="buttonClass"
    flat
    dense
    no-caps
    :style="buttonStyle"
    v-bind="$attrs"
    v-on="$emit"
  >
    <template #default>
      <q-icon :name="icon" v-if="icon" />
      <span v-if="label"> {{ label }}</span>
    </template>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "CustomButton",
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const buttonClass = computed(() => {
      switch (props.type) {
        case "primary":
          return "custom-button-primary";
        case "secondary":
          return "custom-button-secondary";
        case "tertiary":
          return "custom-button-tertiary";
        default:
          return "";
      }
    });

    const buttonStyle = computed(() => {
      switch (props.type) {
        case "primary":
          return {
            backgroundColor: "$primary",
            color: "$text-primary",
          };
        case "secondary":
          return {
            borderColor: "var(--secondary)",
            backgroundColor: "var(--background-outline)",
            color: "var(--secondary)",
          };
        case "tertiary":
          return {
            borderColor: "var(--border-color)",
            color: "var(--dark1-default)",
          };
        default:
          return {};
      }
    });

    return { buttonClass, buttonStyle };
  },
});
</script>

<style scoped lang="scss">
.custom-button-secondary {
  border-style: solid;
}

.custom-button-tertiary {
  border-style: solid;
}
</style>
