"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ToastOptions {
  title?: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  toastData: ToastOptions | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastData, setToastData] = useState<ToastOptions | null>(null);

  function toast(options: ToastOptions) {
    setToastData(options);
    setTimeout(() => setToastData(null), 3000);
  }

  return (
    <ToastContext.Provider value={{ toast, toastData }}>
      {children}

      {toastData && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 shadow-lg p-4 rounded-xl w-64">
          {toastData.title && (
            <p className="font-semibold text-gray-800">{toastData.title}</p>
          )}
          {toastData.description && (
            <p className="text-sm text-gray-600 mt-1">{toastData.description}</p>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}
