export type ModalComponent = {
  open: () => void;
  close: () => void;
}

export type AppointmentModalComponet = {
  onOpen: (start: string) => void;
  onEdit: (appointmentSelected: any) => void;
  close: () => void;
}

export type IOptions = {
  label: string | null;
  value: string | number | null;
}
