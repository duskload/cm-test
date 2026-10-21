import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { useAuthStore } from "../../stores/auth-store";

export function OnboardingScreen() {
  const [token, setToken] = useState("");
  const setApiToken = useAuthStore((state) => state.setApiToken);
  const canSubmit = token.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    setApiToken(token.trim());
    router.replace("/balance");
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", default: undefined })} style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>CASHMINE</Text>
        <Text style={styles.title}>Connect your account</Text>
        <Text style={styles.description}>Enter the API token from your task email to view your balance and claims.</Text>
        <TextInput autoCapitalize="none" autoCorrect={false} autoFocus onChangeText={setToken} onSubmitEditing={submit} placeholder="API token" returnKeyType="done" secureTextEntry style={styles.input} value={token} />
        <Pressable accessibilityRole="button" disabled={!canSubmit} onPress={submit} style={({ pressed }) => [styles.button, !canSubmit && styles.buttonDisabled, pressed && canSubmit && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", padding: 24 }, content: { gap: 16 },
  eyebrow: { color: "#2563EB", fontSize: 13, fontWeight: "700", letterSpacing: 1.3 }, title: { color: "#0F172A", fontSize: 32, fontWeight: "700", letterSpacing: -0.8 },
  description: { color: "#475569", fontSize: 16, lineHeight: 24, marginBottom: 8 }, input: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: 12, borderWidth: 1, color: "#0F172A", fontSize: 16, minHeight: 52, paddingHorizontal: 16 },
  button: { alignItems: "center", backgroundColor: "#2563EB", borderRadius: 12, minHeight: 52, justifyContent: "center" }, buttonDisabled: { backgroundColor: "#94A3B8" }, buttonPressed: { opacity: 0.82 }, buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
