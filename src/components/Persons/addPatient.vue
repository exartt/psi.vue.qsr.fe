<template>
  <Modal title="Adicionar Paciente" ref="responsiveModal">
    <template #body>
      <q-form ref="addPatientForm" class="row full-width">
        <input-component
          :class="responsiveConfig(true)"
          label="Nome"
          v-model="person.Name"
          :rules="[val => !!val || 'Nome é obrigatório']"
        />
        <input-component
          :class="responsiveConfig(true)"
          label="Email"
          v-model="person.Email"
          :rules="[val => !!val || 'Email é obrigatório', emailRule]"
        />

        <input-component
          :class="responsiveConfig()"
          label="Celular"
          v-model="person.CellPhone"
          :mask="'(##) #####-####'"
          :rules="[val => !!val || 'Celular é obrigatório', phoneRule]"
        />
        <input-component label="Telefone" v-model="person.Phone" :class="responsiveConfig()" />
        <input-component label="CEP" v-model="person.ZipCode" :class="responsiveConfig()" />
        <input-component label="Endereço" v-model="person.Address" :class="responsiveConfig()" />
        <input-component label="CPF" v-model="person.CPF" :class="responsiveConfig()" />
        <input-component label="RG" v-model="person.RG" :class="responsiveConfig()" />
        <input-component
          label="Preço da Sessão"
          v-model="person.SessionPrice"
          mask="#"
          fill-mask="0"
          reverse-fill-mask
          :rules="[val => (person.IsPlan ? true : !!val) || 'Preço da Sessão é obrigatório']"
          :class="responsiveConfig()"
        />
        <input-component
        :class="responsiveConfig()"
          label="Tipo de Conversão"
          v-model="person.ConversionType"
        />
        <q-toggle v-model="person.IsActive" label="Ativo" />
        <q-toggle v-model="person.IsPlan" label="Pagamento Mensal" />
      </q-form>
    </template>
    <template #btn-section>
      <div style="display: flex; justify-content: flex-end;">
        <s-button label="Fechar" @click="close()" type="tertiary" class="q-px-sm" />
        <s-button :label="editMode ? 'Editar' : 'Adicionar'" @click="persistPerson" type="primary" />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from "src/components/components-structure/modal.vue";
import { ModalComponent } from 'src/interfaces/IComponents';
import InputComponent from 'src/components/components-structure/input.vue';
import SButton from 'src/components/components-structure/button.vue';
import useApi from 'src/composables/requests';
import { useSweetAlert2 } from 'src/composables/useSweetalert';


export default defineComponent({
  components: {
    Modal,
    SButton,
    InputComponent
  },
  setup(_, { emit }) {
    const { post, put } = useApi();
    const responsiveModal = ref<ModalComponent | null>(null);
    const message = useSweetAlert2();
    const path = "/patient/v1";
    const person = ref({
      ID: 0,
      PersonId: 0,
      Name: '',
      Email: '',
      CellPhone: '',
      Phone: '',
      ZipCode: '',
      Address: '',
      IsActive: true,
      CPF: '',
      RG: '',
      IsPlan: true,
      SessionPrice: "140",
      ConversionType: 'Propaganda'
    });

    const emailRule = (val: any) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(val) || 'Email inválido';
    };

    const phoneRule = (val: any) => {
      const phonePattern = /^\(\d{2}\)\s\d{5}-\d{4}$/;
      return phonePattern.test(val) || 'Celular inválido';
    };


    const responsiveConfig = (fullLine: boolean = false) => {
      if (fullLine) {
        return "col-12";
      }
      return "col-12 q-pb-md";
    };

    const validateToSubmit = (): boolean => {
      let allowSubmit = true;
      let errorMessages = [];

      if (!person.value.Name) {
        allowSubmit = false;
        errorMessages.push("Nome");
      }
      if (!person.value.Email) {
        allowSubmit = false;
        errorMessages.push("Email");
      }
      if (!person.value.CellPhone) {
        allowSubmit = false;
        errorMessages.push("Celular");
      }
      if (!allowSubmit) {
        message.fire({
          icon: "warning",
          title: "Informações necessárias",
          html:
            errorMessages.length > 1
              ? "Por favor, preencha os campos:<br><br>" +
                errorMessages.map((msg) => `${msg}<br>`).join("")
              : `Por favor, preencha o campo ${errorMessages[0]}`,
        });
      }
      return allowSubmit;
    };

    const resetFields = () => {
      person.value = {
        ID: 0,
        PersonId: 0,
        Name: '',
        Email: '',
        CellPhone: '',
        Phone: '',
        ZipCode: '',
        Address: '',
        IsActive: true,
        CPF: '',
        RG: '',
        IsPlan: true,
        SessionPrice: "140",
        ConversionType: 'Propaganda'
      };
    };
    const editMode = ref(false)
    const open = (isEdit: boolean = false, object: any) => {
      resetFields();
      if (isEdit) {
        person.value = object;
        editMode.value = true
      }
      responsiveModal.value?.open();
    };

    const close = () => {
      responsiveModal.value?.close();
    };

    const persistPerson = () => {
      if (editMode) {
        editPerson();
        return;
      }
      if (validateToSubmit()) {
        return post(`${path}/create-patient`, person.value)
          .then((response: any) => {
              emit('added-person', person.value);
              close();
          })
          .catch((error) => {
            message.fire({
              icon: "error",
              title: `Erro ${error.response.status}`,
              text: error.response.data,
            });
          });
      }
    };

    const editPerson = () => {
      if (validateToSubmit()) {
        return put(`${path}/update-patient/`, person.value)
          .then((response: any) => {
              emit('added-person', person.value);
              close();
          })
          .catch((error) => {
            message.fire({
              icon: "error",
              title: `Erro ${error.response.status}`,
              text: error.response.data,
            });
          });
      }
    }
    return {
      person,
      persistPerson,
      editMode,
      responsiveConfig,
      open,
      close,
      emailRule,
      phoneRule,
      responsiveModal
    };
  }
});
</script>
