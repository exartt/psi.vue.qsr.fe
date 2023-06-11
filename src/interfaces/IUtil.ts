import { Ref } from 'vue';

export interface IUtils {
  showLoading: (msg: string) => void;
  hideLoading: () => void;
}

export type RequestMessage = {
  success: {
    title: string | null,
    message: string | null
  },
  error: {
    title: string | null,
    message: string | null
  },
}

export interface ApiMethods {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<void>;
  put: (url: string, data: any) => Promise<void>;
  delete: (url: string) => Promise<void>;
  error: Ref<Error| null>;
}
