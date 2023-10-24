import { Ref } from "vue";

export interface IUtils {
  showLoading: (msg: string) => void;
  hideLoading: () => void;
}

export type RequestMessage = {
  success: {
    title: string | null;
    message: string | null;
  };
  error: {
    title: string | null;
    message: string | null;
  };
};

export interface ApiMethods {
  get: (url: string, showMessage: boolean) => Promise<any>;
  post: (url: string, data: any) => Promise<void>;
  put: (url: string, data: any) => Promise<void>;
  deletar: (url: string) => Promise<void>;
  error: Ref<Error | null>;
}

export type EventType = {
  ID: number;
  PsychologistID: number;
  PatientID: number;
  TenantID: number;
  EventID: string;
  Start: string;
  End: string;
  Summary: string;
  Description: string;
  Location: string;
  Status: string;
  Notify: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};
