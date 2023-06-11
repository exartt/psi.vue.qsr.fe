import { ref, getCurrentInstance } from 'vue';
import { useQuasar } from 'quasar';
import { ApiMethods, RequestMessage } from '@/interfaces/IUtil';
import { AxiosResponse } from 'axios';
import { useSweetAlert2 } from "src/composables/useSweetalert";

export default function useApi(): ApiMethods {
  const $q = useQuasar();
  const error = ref<null | Error>(null);
  const internalInstance = getCurrentInstance();
  const message = useSweetAlert2();

  const defaultMessage: RequestMessage = { success: { title: null, message: "Requisição bem sucedida!" },
  error: { title: "Oops...", message: "Ocorreu um erro inesperado! Aguarde alguns instantes e tente novamente" } }

  const get = async (url: string, showMessage: boolean = true, requestMessage: RequestMessage = defaultMessage): Promise<any> => {
    try {
      $q.loading.show();
      const response: AxiosResponse<any> | undefined = await internalInstance?.appContext.config.globalProperties.$gateway.get(url);
      if (!response) {
        throw new Error("Servidor não retornou nenhuma resposta.");
      }
      if (showMessage) {
        message.fire({
          icon: 'success',
          title: requestMessage.success.title ? requestMessage.success.title : undefined,
          text: requestMessage.success.message ? requestMessage.success.message : undefined,
        })
      }
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      message.fire({
        icon: 'error',
        title: requestMessage.error.title ? requestMessage.error.title : undefined,
        text: requestMessage.error.message ? requestMessage.error.message : undefined,
      })
    } finally {
      $q.loading.hide();
    }
  };

  const post = async (url: string, data: any, requestMessage: RequestMessage = defaultMessage): Promise<void> => {
    try {
      $q.loading.show();
      await internalInstance?.appContext.config.globalProperties.$gateway.post(url, data);
      message.fire({
        icon: 'success',
        title: requestMessage.success.title ? requestMessage.success.title : undefined,
        text: requestMessage.success.message ? requestMessage.success.message : undefined,
      })
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      $q.loading.hide();
    }
  };

  const put = async (url: string, data: any, RequestMessage: RequestMessage = defaultMessage): Promise<void> => {
    try {
      $q.loading.show();
      await internalInstance?.appContext.config.globalProperties.$gateway.put(url, data);
      console.log("Dados atualizados com sucesso!");
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error("Erro ao atualizar dados:", error.value);
    } finally {
      $q.loading.hide();
    }
  };

  const remove = async (url: string, RequestMessage: RequestMessage = defaultMessage): Promise<void> => {
    try {
      $q.loading.show();
      await internalInstance?.appContext.config.globalProperties.$gateway.delete(url);
      console.log("Dados excluídos com sucesso!");
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error("Erro ao excluir dados:", error.value);
    } finally {
      $q.loading.hide();
    }
  };

  return { get, post, put, delete: remove, error };
}
