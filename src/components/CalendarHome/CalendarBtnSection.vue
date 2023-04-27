<template>
  <div class="row justify-between row-relative">
    <div :class="isMobile" style="min-height: 65px">
      <div class="row">
        <div class="col-auto" style="min-width: 60px">
          <q-avatar
            class="full-height full-width q-px-xs text-subtitle1"
            size="xl"
            font-size="18px"
            square
            color="primary"
            text-color="white"
            style="border-radius: 8px 0px 0px 8px">
              {{ getTimeScheduled }}
          </q-avatar>
        </div>
        <div :class="isMobile">
          <q-item>
            <q-item-section>
              <div class="column info-container">
                <span v-if="clientName" class="text-subtitle2 truncate"> {{ clientName }}</span>
                <span v-if="description" class="text-body2 truncate"> {{ description }} </span>
                <span v-else-if="summary" class="text-body2 truncate"> {{  summary }}</span>
                <span v-else class="text-body2 truncate"> Consulta psicológica </span>
                <span class="text-caption truncate"> {{ getDataInicioFimFormatada }}</span>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>
    <div class="self-center slot-btn" v-if="!$q.platform.is.mobile">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
export default {
  name: 'CalendarBtnSection',
  props: {
    clientName: String,
    description: String,
    summary: String,
    getDataInicioFimFormatada: String,
    getTimeScheduled: String
  },
  setup() {
    const $q = useQuasar()

    const isMobile = computed<String>(() => {
      return $q.platform.is.mobile ? 'col-12' : 'col-10'
    })
    return {
      isMobile,
      $q
    }
  }
}
</script>

  <style scoped>
  .row-relative {
    position: relative;
  }
  .row-relative .slot-btn {
    position: absolute;
    right: 0px;
    bottom: 30%;
  }
  .info-container {
    max-width: 100%;
  }
  .truncate {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style>
