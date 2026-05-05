import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

// Store global fora do React para que qualquer módulo possa disparar toasts
let toastId = 0;
let toasts: ToastItem[] = [];
const listeners = new Set<(t: ToastItem[]) => void>();

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function toast(type: ToastType, message: string) {
  const id = ++toastId;
  toasts = [...toasts, { id, type, message }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-300 text-green-800',
  error: 'bg-red-50 border-red-300 text-red-800',
  info: 'bg-blue-50 border-blue-300 text-blue-800',
};

const toastIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setItems);
    return () => { listeners.delete(setItems); };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg border shadow-md',
            'text-sm font-medium min-w-[280px] max-w-sm',
            'animate-in slide-in-from-right',
            toastStyles[item.type],
          )}
        >
          <span className="font-bold">{toastIcons[item.type]}</span>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  );
};
