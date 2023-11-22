<template>
  <q-page class="q-pa-xl">
    <div style="display: flex; flex-direction: column;">
      <span class="text-h2 color-grey font-noto-500"> {{ title }} </span>
      <span class="text-h5 q-py-md q-pb-lg color-grey font-noto-400"> {{ subtitle }}</span>
      <slot />
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>
