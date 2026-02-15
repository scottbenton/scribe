import { AuthStatus, useAuthStore } from "@/store/auth.store";
import { useMemo, type PropsWithChildren } from "react";
import { Redirect, useLocation, useSearchParams } from "wouter";

export interface AuthBlockerProps {
  redirectIfUnauthenticated?: string;
  redirectIfAuthenticated?: string;
  redirectWithContinue?: boolean;
}

export function AuthBlocker(props: PropsWithChildren<AuthBlockerProps>) {
  const {
    children,
    redirectIfUnauthenticated,
    redirectIfAuthenticated,
    redirectWithContinue,
  } = props;

  const authStatus = useAuthStore((store) => store.status);

  const [location] = useLocation();

  const [searchParams] = useSearchParams();
  const continueParam = useMemo(() => {
    const baseParam = searchParams.get("continue");
    if (!baseParam) return undefined;
    return decodeURIComponent(baseParam);
  }, [searchParams]);

  const unauthenticatedRedirectUrl = useMemo(() => {
    if (!redirectIfUnauthenticated) return undefined;

    if (continueParam) {
      const continuePath = decodeURIComponent(continueParam);
      return continuePath;
    }

    return redirectWithContinue
      ? `${redirectIfUnauthenticated}?continue=${encodeURIComponent(location)}`
      : redirectIfUnauthenticated;
  }, [
    continueParam,
    location,
    redirectIfUnauthenticated,
    redirectWithContinue,
  ]);

  const authenticatedRedirectUrl = useMemo(() => {
    if (!redirectIfAuthenticated) return undefined;

    if (continueParam) {
      const continuePath = decodeURIComponent(continueParam);
      return continuePath;
    }

    return redirectWithContinue
      ? `${redirectIfAuthenticated}?continue=${encodeURIComponent(location)}`
      : redirectIfAuthenticated;
  }, [continueParam, location, redirectIfAuthenticated, redirectWithContinue]);

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  if (unauthenticatedRedirectUrl && authStatus === AuthStatus.Unauthenticated) {
    return <Redirect to={unauthenticatedRedirectUrl} />;
  }

  if (authenticatedRedirectUrl && authStatus === AuthStatus.Authenticated) {
    return <Redirect to={authenticatedRedirectUrl} />;
  }

  return children;
}
