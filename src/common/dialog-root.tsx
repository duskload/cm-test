import { Fragment } from "react";

import { useDialogStore } from "./dialog-store";

export function DialogRoot() {
  const dialogs = useDialogStore((state) => state.dialogs);
  const closeDialog = useDialogStore((state) => state.closeDialog);

  return dialogs.map((dialog) => (
    <Fragment key={dialog.id}>{dialog.render(() => closeDialog(dialog.id))}</Fragment>
  ));
}
