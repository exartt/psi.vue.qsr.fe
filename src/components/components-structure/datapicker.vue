<template>
  <div>
    <q-input
      v-model="formattedDateTime"
      outlined
      dense
      filled
      color="primary"
      @click="openDatePicker"
      readonly
    >
      <template v-slot:append>
        <q-icon name="event" color="primary" @click="openDatePicker" />
      </template>
    </q-input>

    <q-dialog v-model="showDateDialog">
      <div class="column bg-white">
        <q-date v-model="selectedDate" color="red" dense flat></q-date>
        <div class="row reverse full-width q-pb-md">
          <div class="col-auto">
            <q-btn
              flat
              label="Próximo"
              class="q-pa-md"
              no-caps
              dense
              :disable="!selectedDate"
              @click="goToTimePicker"
            />
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-model="showTimeDialog">
      <div class="row bg-white">
        <div class="column">
          <q-time v-model="selectedTime" flat dense></q-time>
          <div class="col-auto q-pt-sm q-pb-md q-px-md">
            <div class="row justify-between">
              <div class="col-auto">
                <q-btn
                  label="Cancelar"
                  dense
                  no-caps
                  flat
                  @click="saveDateTime"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  label="Voltar"
                  dense
                  no-caps
                  flat
                  @click="saveDateTime"
                  class="q-mr-md-sm"
                />
                <q-btn
                  label="Salvar"
                  dense
                  no-caps
                  flat
                  @click="saveDateTime"
                  class="q-ml-md-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "DateTimePicker",
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const showDateDialog = ref(false);
    const showTimeDialog = ref(false);

    const selectedDate = ref("");
    const selectedTime = ref("");

    const formattedDateTime = computed({
      get: () => selectedDate.value + " " + selectedTime.value,
      set: (value) => {
        const [date, time] = value.split(" ");
        selectedDate.value = date;
        selectedTime.value = time;
      },
    });

    if (props.modelValue) {
      formattedDateTime.value = props.modelValue;
    }

    const openDatePicker = () => {
      showDateDialog.value = true;
    };

    const goToTimePicker = () => {
      showDateDialog.value = false;
      showTimeDialog.value = true;
    };

    const saveDateTime = () => {
      showTimeDialog.value = false;
      emit("update:modelValue", formattedDateTime.value);
    };

    return {
      showDateDialog,
      showTimeDialog,
      selectedDate,
      selectedTime,
      formattedDateTime,
      openDatePicker,
      goToTimePicker,
      saveDateTime,
    };
  },
});
</script>
