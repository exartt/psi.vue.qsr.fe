<template>
  <container>
    <div class="column">
      <div class="row">
        <div class="col-auto">
          <span> {{ header }} </span>
        </div>
      </div>
      <slot></slot>
    </div>
  </container>
</template>

<script lang="ts">
export default {
  name: "CardContainer",
  props: {
    header: String,
  },
};
</script>

<style>
</style>
