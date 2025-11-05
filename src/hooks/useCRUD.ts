'use client';

import { useState, useCallback } from 'react';

export interface CRUDState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export interface CRUDActions<T> {
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  deleteItem: (id: string) => void;
  setItems: (items: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getItemById: (id: string) => T | undefined;
}

export function useCRUD<T extends { id: string }>(initialItems: T[] = []): [CRUDState<T>, CRUDActions<T>] {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getItemById = useCallback((id: string) => {
    return items.find((item) => item.id === id);
  }, [items]);

  const state = { items, loading, error };
  const actions = {
    addItem,
    updateItem,
    deleteItem,
    setItems,
    setLoading,
    setError,
    getItemById,
  };

  return [state, actions];
}
