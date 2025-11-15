"use client";

import { useState } from "react";

export interface ToastOptions {
  title?: string;
  description?: string;
}

export function useToast() {
  const [toastData, setToastData] = useState<ToastOptions | null>(null);

  function toast(options: ToastOptions) {
    setToastData(options);

    // Ocultar después de 3s
    setTimeout(() => setToastData(null), 3000);
  }

  return {
    toast,
    toastData,
  };
}

export default useToast;
