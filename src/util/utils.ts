import { Loading } from 'quasar';
import { InjectionKey } from 'vue';
import { IUtils } from './IUtil';

export const UtilKey: InjectionKey<IUtils> = Symbol('IUtils');

const utils: IUtils = {
  showLoading(msg: string) {
    Loading.show({
      message: msg,
    });
  },
  hideLoading() {
    Loading.hide();
  },
};

export { utils };
