'use client';

import { useEffect, useRef, useState } from 'react';

interface DebouncedButtonState {
  label: string;
  disabled: boolean;
}

interface UseDebouncedButtonOptions {
  defaultLabel: string;
  loadingLabel: string;
  successLabel?: string;
  errorLabel?: string;
  debounceMs?: number;
  resetAfterMs?: number;
}

export function useDebouncedButton({
  defaultLabel,
  loadingLabel,
  successLabel = 'Saved Successfully',
  errorLabel = 'Save Failed',
  debounceMs = 300,
  resetAfterMs = 2000,
}: UseDebouncedButtonOptions) {
  const [state, setState] = useState<DebouncedButtonState>({
    label: defaultLabel,
    disabled: false,
  });

  const timeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const setLoading = () => {
    // Clear any existing timeouts
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);

    // Debounce the loading state change
    timeoutRef.current = window.setTimeout(() => {
      setState({
        label: loadingLabel,
        disabled: true,
      });
    }, debounceMs);
  };

  const setSuccess = () => {
    // Clear loading timeout
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    setState({
      label: successLabel,
      disabled: false,
    });

    // Reset to default after a delay
    resetTimeoutRef.current = window.setTimeout(() => {
      setState({
        label: defaultLabel,
        disabled: false,
      });
    }, resetAfterMs);
  };

  const setError = () => {
    // Clear loading timeout
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    setState({
      label: errorLabel,
      disabled: false,
    });

    // Reset to default after a delay
    resetTimeoutRef.current = window.setTimeout(() => {
      setState({
        label: defaultLabel,
        disabled: false,
      });
    }, resetAfterMs);
  };

  const reset = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);

    setState({
      label: defaultLabel,
      disabled: false,
    });
  };

  return {
    ...state,
    setLoading,
    setSuccess,
    setError,
    reset,
  };
}
