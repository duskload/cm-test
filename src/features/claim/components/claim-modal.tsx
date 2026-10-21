import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../../../design-system/colors";
import { formatAssetAmount } from "../../../design-system/number-format";
import { ApiError } from "../../../lib/api-client";
import {
  createClaim,
  getClaim,
  type ClaimStatus,
  type ClaimableBalance,
} from "../claim-api";
import {
  compareDecimals,
  createIdempotencyKey,
  isValidAmount,
  subtractDecimals,
} from "../claim-utils";

type Props = {
  balance: ClaimableBalance;
  onClose: () => void;
};
type Phase = "editing" | "submitting" | "processing" | "completed" | "failed";
const DESTINATION_ID = "dest_wallet";

export function ClaimModal({ balance, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey);
  const [claim, setClaim] = useState<ClaimStatus | null>(null);
  const [phase, setPhase] = useState<Phase>("editing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!claim || phase !== "processing") return;
    let active = true;
    const check = async () => {
      try {
        const nextClaim = await getClaim(claim.id);
        if (!active) return;
        setClaim(nextClaim);
        const status = nextClaim.status.toLowerCase();
        if (["completed", "complete", "settled"].includes(status)) setPhase("completed");
        if (["failed", "rejected", "cancelled", "canceled"].includes(status)) setPhase("failed");
      } catch {
        // Keep the submitted claim visible while a temporary status check fails.
      }
    };
    void check();
    const interval = setInterval(() => void check(), 3_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [claim, phase]);

  const validAmount =
    isValidAmount(amount, balance.decimals) &&
    compareDecimals(amount, "0") > 0n &&
    compareDecimals(amount, balance.available) <= 0n;
  const receivedAmount =
    claim?.fee && amount ? subtractDecimals(amount, claim.fee) : null;

  function setInputAmount(value: string) {
    setAmount(value);
    setIdempotencyKey(createIdempotencyKey());
    setError(null);
  }

  async function submit() {
    if (!validAmount) {
      setError(
        `Enter an amount up to ${formatAssetAmount(balance.available, balance.asset)} ${balance.asset}, using at most ${balance.decimals} decimal places.`,
      );
      return;
    }
    setPhase("submitting");
    setError(null);
    try {
      const createdClaim = await createClaim({
        asset: balance.asset,
        amount,
        destinationId: DESTINATION_ID,
        idempotencyKey,
      });
      setClaim(createdClaim);
      setPhase("processing");
    } catch (caughtError) {
      setPhase("editing");
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "We couldn’t submit your claim. Please try again.",
      );
    }
  }

  const title =
    phase === "completed"
      ? "Claim completed"
      : phase === "failed"
        ? "Claim wasn’t completed"
        : phase === "processing"
          ? "Your claim is processing"
          : "Claim your asset";
  const message =
    phase === "completed"
      ? "Your claim has completed successfully."
      : phase === "failed"
        ? (claim?.error ??
          "Your claim was not completed. Your funds remain available to claim.")
        : phase === "processing"
          ? "We’re confirming your claim. Please don’t submit it again while we check its result."
          : "Choose how much you’d like to claim.";

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={styles.backdrop}
      >
        <View style={styles.dialog}>
          <ScrollView bounces={false} contentContainerStyle={styles.content}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>
              {phase !== "processing" && (
                <Pressable
                  accessibilityLabel="Close claim dialog"
                  accessibilityRole="button"
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              )}
            </View>
            {phase === "editing" || phase === "submitting" ? (
              <>
                <View style={styles.available}>
                  <Text style={styles.availableLabel}>Available</Text>
                  <Text style={styles.availableValue}>
                    {formatAssetAmount(balance.available, balance.asset)} {balance.asset}
                  </Text>
                </View>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    autoFocus
                    keyboardType="decimal-pad"
                    onChangeText={setInputAmount}
                    placeholder="0.00"
                    style={styles.input}
                    value={amount}
                  />
                  <Pressable
                    onPress={() => setInputAmount(balance.available)}
                    style={styles.maxButton}
                  >
                    <Text style={styles.maxText}>Max</Text>
                  </Pressable>
                </View>
                <Text style={styles.hint}>
                  Fee and final received amount are confirmed by the claim service after submission.
                </Text>
                {error && <Text style={styles.error}>{error}</Text>}
                <Pressable
                  disabled={phase === "submitting"}
                  onPress={() => void submit()}
                  style={({ pressed }) => [
                    styles.submit,
                    (pressed || phase === "submitting") && styles.submitPressed,
                  ]}
                >
                  {phase === "submitting" ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <Text style={styles.submitText}>Confirm and submit</Text>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.result}>
                  <Text style={styles.resultLabel}>Claim amount</Text>
                  <Text style={styles.resultValue}>
                    {formatAssetAmount(amount, balance.asset)} {balance.asset}
                  </Text>
                  {claim?.fee && (
                    <>
                      <Text style={styles.resultLabel}>Fee</Text>
                      <Text style={styles.resultValue}>
                        {formatAssetAmount(claim.fee, balance.asset)} {balance.asset}
                      </Text>
                      <Text style={styles.resultLabel}>You receive</Text>
                      <Text style={styles.received}>
                        {formatAssetAmount(receivedAmount ?? "0", balance.asset)} {balance.asset}
                      </Text>
                    </>
                  )}
                </View>
                {phase === "processing" && (
                  <ActivityIndicator color={colors.primary} size="large" style={styles.spinner} />
                )}
                {phase !== "processing" && (
                  <Pressable onPress={onClose} style={styles.submit}>
                    <Text style={styles.submitText}>Done</Text>
                  </Pressable>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(11,31,51,0.44)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    maxHeight: "88%",
    maxWidth: 480,
    overflow: "hidden",
    width: "100%",
  },
  content: { padding: 20, paddingBottom: 24 },
  titleRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  message: { color: colors.textMuted, flexShrink: 1, fontSize: 15, lineHeight: 22, marginTop: 6 },
  closeButton: { alignItems: "center", height: 36, justifyContent: "center", marginLeft: 12, width: 36 },
  closeText: { color: colors.textMuted, fontSize: 30, fontWeight: "300", lineHeight: 32 },
  available: { backgroundColor: colors.primarySoft, borderRadius: 14, flexDirection: "row", justifyContent: "space-between", marginTop: 20, padding: 14 },
  availableLabel: { color: colors.primaryStrong, fontWeight: "700" },
  availableValue: { color: colors.text, fontWeight: "800" },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginTop: 20 },
  inputRow: { alignItems: "center", borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: "row", marginTop: 8, paddingHorizontal: 14 },
  input: { color: colors.text, flex: 1, fontSize: 22, fontWeight: "700", minHeight: 54 },
  maxButton: { backgroundColor: colors.primarySoft, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  maxText: { color: colors.primaryStrong, fontWeight: "800" },
  hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  error: { color: colors.warningStrong, fontSize: 13, lineHeight: 19, marginTop: 12 },
  submit: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 12, justifyContent: "center", marginTop: 22, minHeight: 52 },
  submitPressed: { opacity: 0.78 },
  submitText: { color: colors.onPrimary, fontSize: 16, fontWeight: "800" },
  result: { backgroundColor: colors.background, borderRadius: 14, gap: 4, marginTop: 20, padding: 16 },
  resultLabel: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
  resultValue: { color: colors.text, fontSize: 17, fontWeight: "800" },
  received: { color: colors.secondary, fontSize: 20, fontWeight: "800" },
  spinner: { marginTop: 24 },
});
