import { useQuasar } from "quasar";
import { InjectionKey } from "vue";
import { IUtils } from "../interfaces/IUtil";

export const UtilKey: InjectionKey<IUtils> = Symbol("IUtils");
const $q = useQuasar();
const utils: IUtils = {
  showLoading(msg: string) {
    $q.loading.show({ message: msg });
  },
  hideLoading() {
    if ($q.loading.isActive) {
      $q.loading.hide();
    }
  },
};

export { utils };
