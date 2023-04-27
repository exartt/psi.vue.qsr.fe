<template>
  <div style="height: 100%">
    <div class="shadow full-height bg-white q-pa-md">
      <div class="row">
        <span class="text-h5 header" v-if="header"> {{ header }}</span>
        <slot name="header" v-else></slot>
      </div>
      <q-separator v-if="header" class="q-mb-sm" />
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainerComponent",
  props: {
    header: String,
  },
};
</script>

<style scoped>
.shadow {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
}
.shadow .header {
  color: rgb(110, 110, 110);
}
</style>
