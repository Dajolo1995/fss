import { useMemo, useState } from 'react';

export interface UseEntityCrudReturn<T> {
  items: T[];
  editingItem: T | undefined;
  drawerOpen: boolean;
  loading: boolean;
  openCreate: () => void;
  openEdit: (item: T) => void;
  closeDrawer: () => void;
  create: (item: T) => void;
  update: (item: T) => void;
  duplicate: (item: T) => void;
  remove: (item: T) => void;
}

export const useEntityCrud = <T extends { id: string }>(initialItems: T[]): UseEntityCrudReturn<T> => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [editingItem, setEditingItem] = useState<T | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading] = useState(false);
  return useMemo(() => ({
    items,
    editingItem,
    drawerOpen,
    loading,
    openCreate: () => { setEditingItem(undefined); setDrawerOpen(true); },
    openEdit: (item: T) => { setEditingItem(item); setDrawerOpen(true); },
    closeDrawer: () => { setEditingItem(undefined); setDrawerOpen(false); },
    create: (item: T) => { setItems((current) => [item, ...current]); setDrawerOpen(false); },
    update: (item: T) => { setItems((current) => current.map((currentItem) => currentItem.id === item.id ? item : currentItem)); setDrawerOpen(false); },
    duplicate: (item: T) => { setItems((current) => [{ ...item, id: `${item.id}-copy-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() }, ...current]); },
    remove: (item: T) => { setItems((current) => current.filter((currentItem) => currentItem.id !== item.id)); },
  }), [drawerOpen, editingItem, items, loading]);
};
