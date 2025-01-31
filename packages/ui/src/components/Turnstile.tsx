"use client";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

interface TurnstileComponentProps {
  siteKey: string; 
  onVerify: (token: string) => void;
  onError?: (error: any) => void; 
  onExpire?: () => void; 
}

export default function TurnstileComponent({
  siteKey,
  onVerify,
  onError,
  onExpire,
}: TurnstileComponentProps) {
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSuccess = (token: string) => {
    setToken(token);
    onVerify(token);
  };

  const handleError = (error: any) => {
    console.error("Turnstile Error:", error);
    onError?.(error);
  };

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      onSuccess={handleSuccess}
      onError={handleError}
      onExpire={onExpire}
    />
  );
}