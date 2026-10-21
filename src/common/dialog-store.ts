import type { ReactNode } from "react";
import { create } from "zustand";

type DialogRenderer = (close: () => void) => ReactNode;
type DialogEntry = { id: number; render: DialogRenderer };

type DialogState = {
  dialogs: DialogEntry[];
  closeDialog: (id: number) => void;
  openDialog: (render: DialogRenderer) => () => void;
};

let nextDialogId = 0;

export const useDialogStore = create<DialogState>((set) => ({
  dialogs: [],
  closeDialog: (id) =>
    set((state) => ({ dialogs: state.dialogs.filter((dialog) => dialog.id !== id) })),
  openDialog: (render) => {
    const id = nextDialogId++;
    set((state) => ({ dialogs: [...state.dialogs, { id, render }] }));
    return () =>
      set((state) => ({ dialogs: state.dialogs.filter((dialog) => dialog.id !== id) }));
  },
}));
