import { useCallback } from "react";

import { ClaimModal } from "../features/claim/components/claim-modal";
import type { ClaimableBalance } from "../features/claim/claim-api";
import { useDialogStore } from "./dialog-store";

export function useOpenClaimDialog() {
  const openDialog = useDialogStore((state) => state.openDialog);
  return useCallback(
    (balance: ClaimableBalance) => {
      openDialog((close) => <ClaimModal balance={balance} onClose={close} />);
    },
    [openDialog],
  );
}
