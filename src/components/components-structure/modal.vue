<template>
  <q-dialog v-model="isOpened" v-bind="$attrs" ref="modalComponent">
    <div class="row container-modal bg-white">
      <div class="row line full-width">
        <div class="row header-modal q-pa-md justify-between full-width">
          <span class="text-h5 items-center"> {{ title }}</span>
          <s-button no-caps flat icon="o_close" @click="close" rounded />
        </div>
      </div>
      <div class="row full-width q-px-md q-pt-md q-pb-sm">
        <slot name="body"></slot>
      </div>
      <div class="row full-width q-pb-md q-px-md">
        <slot name="btn-section"></slot>
      </div>
    </div>
  </q-dialog>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import SButton from "./button.vue";

export default defineComponent({
  name: "ResponsiveModal",
  props: {
    title: {
      required: true,
      type: String,
    },
  },
  components: {
    SButton,
  },
  setup(_, { emit }) {
    const isOpened = ref(false);

    const open = () => {
      isOpened.value = true;
    };

    const close = () => {
      isOpened.value = false;
    };

    return {
      isOpened,
      open,
      close,
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
