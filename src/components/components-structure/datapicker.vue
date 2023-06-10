<template>
  <div>
    <q-input
      v-model="formattedDateTime"
      outlined
      dense
      filled
      color="primary"
      @click="openDatePicker"
    >
      <template v-slot:append>
        <q-icon name="event" color="primary" @click="openDatePicker" />
      </template>
    </q-input>

    <q-dialog v-model="showDateDialog">
      <div class="column bg-white">
        <q-date v-model="selectedDate" color="red" dense flat></q-date>
        <div class="row justify-end full-width">
          <div class="col-4">
            <q-btn
              flat
              label="Próximo"
              class="q-pa-md"
              dense
              :disable="!selectedDate"
              @click="goToTimePicker"
            />
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-model="showTimeDialog">
      <q-card>
        <q-card-section>
          <q-time v-model="selectedTime"></q-time>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Salvar" @click="saveDateTime" />
        </q-card-actions>
      </q-card>
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
