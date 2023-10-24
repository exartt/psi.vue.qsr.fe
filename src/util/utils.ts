import { useQuasar } from "quasar";
import { InjectionKey } from "vue";
import { IUtils } from "../interfaces/IUtil";
import { useAuthStore } from "src/stores/authStore";

export const UtilKey: InjectionKey<IUtils> = Symbol("IUtils");
const quasar = useQuasar();
const utils: IUtils = {
  showLoading(msg: string) {
    quasar.loading.show({ message: msg });
  },
  hideLoading() {
    if (quasar.loading.isActive) {
      quasar.loading.hide();
    }
  },
};

export { utils, quasar };

export function checkAuthorization() {
  return (
    localStorage.getItem("Authorization") !== null ||
    useAuthStore().getStatusToken
  );
}
