<template>
  <container removePadding class="container">
    <template #header>
      <div class="column q-pl-sm header">
        <div class="col-auto">
          <span class="text-grey text-weight-light"> Situação financeira </span>
        </div>
        <div class="col-auto">
          <div class="row full-height items-center">
            <div class="col-6 q-pl-sm">
              <span class="text-weight-regular" style="font-size: 1.5em">
                Sessões Pagas:
              </span>
            </div>
            <div class="col-6">
              <div class="row justify-center">
                <span
                  class="text-weight-regular"
                  style="color: green; font-size: 5em"
                  >2</span
                >
              </div>
            </div>
          </div>
        </div>
        <!-- Todo -> implementar aqui -->
        <!-- <span class="text-grey text-weight-regular" v-else-if="negativo">
          Sessões Pagas:
        </span>
        <span class="text-grey text-weight-regular" v-else>
          Sessões Pagas:
        </span> -->
      </div>
    </template>
  </container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Container from "../components-structure/container.vue";
export default defineComponent({
  name: "FinancialStatus",
  components: {
    Container,
  },
  props: {
    status: Number,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
@import "../../css/quasar.variables.scss";
.container.header.text-grey {
  font-size: 1.9em;
  color: $grey-regular;
}
.container .header {
  width: 100%;
  height: 100%;
}
.container {
  height: 150px;
}
</style>
