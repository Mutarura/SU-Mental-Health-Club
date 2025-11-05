'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ messages, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {messages.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-50 border-green-200'
      : toast.type === 'error'
      ? 'bg-red-50 border-red-200'
      : 'bg-blue-50 border-blue-200';

  const textColor =
    toast.type === 'success'
      ? 'text-green-800'
      : toast.type === 'error'
      ? 'text-red-800'
      : 'text-blue-800';

  const iconColor =
    toast.type === 'success'
      ? 'text-green-500'
      : toast.type === 'error'
      ? 'text-red-500'
      : 'text-blue-500';

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border shadow-lg max-w-sm ${bgColor}`}
    >
      {toast.type === 'success' && (
        <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
      )}
      {toast.type === 'error' && (
        <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColor}`}>{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className={`flex-shrink-0 p-1 hover:bg-white/50 rounded transition`}
      >
        <X className={`w-4 h-4 ${textColor}`} />
      </button>
    </div>
  );
}

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setMessages((prev) => prev.filter((t) => t.id !== id));
  };

  return { messages, addToast, removeToast };
}
