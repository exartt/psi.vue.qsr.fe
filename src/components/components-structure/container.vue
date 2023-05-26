<template>
  <div>
    <div :class="containerClasses">
      <div class="row" v-if="header">
        <span class="text-h5 header"> {{ header }}</span>
      </div>
      <slot name="header" v-else></slot>
      <q-separator v-if="header" class="q-mb-sm" />
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "ContainerComponent",
  props: {
    header: String,
    isFlat: Boolean,
    removePadding: Boolean,
  },
  setup(props) {
    const containerClasses = computed(() => {
      const classes = ["full-height", "bg-white", "container"];
      if (!props.isFlat) {
        classes.push("shadow");
      }
      if (!props.removePadding) {
        classes.push("q-pa-md");
      }
      return classes.join(" ");
    });

    return {
      containerClasses,
    };
  },
});
</script>

<style scoped lang="scss">
.shadow {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
.container {
  border-radius: 10px;
}
.container .header {
  color: rgb(150, 150, 150);
}
</style>
