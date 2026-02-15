import { AuthRepository } from "@/lib/repository/auth.repository";
import { createImmerStore } from "./createImmerStore";
import { useEffect } from "react";

export enum AuthStatus {
  Loading,
  Unauthenticated,
  Authenticated,
}

interface AuthStoreState {
  status: AuthStatus;
  uid: string | undefined;
  token: string | undefined;
}
interface AuthStoreActions {
  subscribeToAuthStatus: () => () => void;
  sendOTPCodeToEmail: (email: string) => Promise<void>;
  verifyOTPCode: (email: string, otpCode: string) => Promise<void>;
  signOut: () => Promise<void>;
}
export const useAuthStore = createImmerStore<AuthStoreState & AuthStoreActions>(
  (set) => ({
    status: AuthStatus.Loading,
    uid: undefined,
    token: undefined,

    subscribeToAuthStatus: () => {
      return AuthRepository.listenToAuthState(
        (uid, accessToken) => {
          set((state) => {
            state.status = AuthStatus.Authenticated;
            state.uid = uid;
            state.token = accessToken;
          });
        },
        () => {
          set((state) => {
            state.status = AuthStatus.Unauthenticated;
            state.uid = undefined;
            state.token = undefined;
          });
        },
      );
    },
    sendOTPCodeToEmail: (email) => {
      return AuthRepository.sendOTPCodeToEmail(email);
    },
    verifyOTPCode: (email, otpCode) => {
      return AuthRepository.verifyOTPCode(email, otpCode);
    },
    signOut: () => {
      return AuthRepository.logout();
    },
  }),
);

export function useUIDOptional() {
  return useAuthStore((state) => state.uid);
}

export function useUID() {
  const uid = useUIDOptional();
  if (!uid) throw new Error("User is not logged in");
  return uid;
}

export function useAuthStatus() {
  return useAuthStore((state) => state.status);
}

export function useListenToAuth() {
  const subscribeToAuthStatus = useAuthStore(
    (store) => store.subscribeToAuthStatus,
  );

  useEffect(() => {
    const unsubscribe = subscribeToAuthStatus();
    return unsubscribe;
  }, [subscribeToAuthStatus]);
}
