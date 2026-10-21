import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = { apiToken: string | null; setApiToken: (token: string) => void; clearApiToken: () => void };
export const useAuthStore = create<AuthState>()(persist((set) => ({ apiToken: null, setApiToken: (apiToken) => set({ apiToken }), clearApiToken: () => set({ apiToken: null }) }), { name: "cashmine-auth", storage: createJSONStorage(() => AsyncStorage) }));
