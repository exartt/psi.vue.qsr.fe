import { ref, getCurrentInstance } from "vue";
import { useQuasar } from "quasar";
import { ApiMethods, RequestMessage } from "src/interfaces/IUtil";
import { AxiosResponse } from "axios";
import { useSweetAlert2 } from "src/composables/useSweetalert";

export default function useApi(): ApiMethods {
  const quasar = useQuasar();
  const error = ref<null | Error>(null);
  const internalInstance = getCurrentInstance();
  const message = useSweetAlert2();

  const defaultMessage: RequestMessage = {
    success: { title: null, message: "Requisição bem sucedida!" },
    error: {
      title: "Oops...",
      message:
        "Ocorreu um erro inesperado! Aguarde alguns instantes e tente novamente",
    },
  };

  const get = async (
    url: string,
    showMessage: boolean = true,
    requestMessage: RequestMessage = defaultMessage
  ): Promise<any> => {
    try {
      quasar.loading.show();
      const response: AxiosResponse<any> | undefined =
        await internalInstance?.appContext.config.globalProperties.$gateway.get(
          url
        );
      if (!response) {
        throw new Error("Servidor não retornou nenhuma resposta.");
      }
      if (showMessage) {
        message.fire({
          icon: "success",
          title: requestMessage.success.title
            ? requestMessage.success.title
            : undefined,
          text: requestMessage.success.message
            ? requestMessage.success.message
            : undefined,
        });
      }
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      const errorMessage = (err as any).response.data;

      message.fire({
        icon: "error",
        title: requestMessage.error.title
          ? requestMessage.error.title
          : undefined,
        text:
          errorMessage.length > 0 ? errorMessage : requestMessage.error.message,
      });
    } finally {
      quasar.loading.hide();
    }
  };

  const post = async (
    url: string,
    data: any,
    requestMessage: RequestMessage = defaultMessage
  ): Promise<void> => {
    try {
      quasar.loading.show();
      const response: AxiosResponse<any> | undefined =
        await internalInstance?.appContext.config.globalProperties.$gateway.post(
          url,
          data
        );
      message.fire({
        icon: "success",
        title: requestMessage.success.title || undefined,
        text: requestMessage.success.message || undefined,
      });
      return response?.data;
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err));
      let errorMessage = requestMessage.error.message;
      if (
        err.response &&
        err.response.data &&
        (err.response.data.message || err.response.data.error)
      ) {
        errorMessage = err.response.data.message
          ? err.response.data.message
          : err.response.data.error;
      }
      message.fire({
        icon: "error",
        title: requestMessage.error.title || undefined,
        text: errorMessage || undefined,
      });
    } finally {
      quasar.loading.hide();
    }
  };

  const put = async (
    url: string,
    data: any,
    RequestMessage: RequestMessage = defaultMessage
  ): Promise<void> => {
    try {
      quasar.loading.show();
      const response: AxiosResponse<any> | undefined =
        await internalInstance?.appContext.config.globalProperties.$gateway.put(
          url,
          data
        );
      console.log("Dados atualizados com sucesso!");
      return response?.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error("Erro ao atualizar dados:", error.value);
    } finally {
      quasar.loading.hide();
    }
  };

  const deletar = async (
    url: string,
    RequestMessage: RequestMessage = defaultMessage
  ): Promise<void> => {
    try {
      quasar.loading.show();
      await internalInstance?.appContext.config.globalProperties.$gateway.delete(
        url
      );
      console.log("Dados excluídos com sucesso!");
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error("Erro ao excluir dados:", error.value);
    } finally {
      quasar.loading.hide();
    }
  };

  return { get, post, put, deletar, error };
}
