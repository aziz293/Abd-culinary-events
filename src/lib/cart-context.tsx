"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
}

export interface FlyingItem {
  key: number;
  imageUrl?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  flyToCart: (originEl: HTMLElement | null, imageUrl?: string) => void;
  flyingItems: FlyingItem[];
  removeFlyingItem: (key: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "abd-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const flyKeyRef = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "qty">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function setQty(id: string, qty: number) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function clear() {
    setItems([]);
  }

  function flyToCart(originEl: HTMLElement | null, imageUrl?: string) {
    if (!originEl) return;
    const target = document.getElementById("cart-icon-target");
    if (!target) return;
    const from = originEl.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const key = flyKeyRef.current++;
    setFlyingItems((prev) => [
      ...prev,
      {
        key,
        imageUrl,
        startX: from.left + from.width / 2,
        startY: from.top + from.height / 2,
        endX: to.left + to.width / 2,
        endY: to.top + to.height / 2,
      },
    ]);
  }

  function removeFlyingItem(key: number) {
    setFlyingItems((prev) => prev.filter((f) => f.key !== key));
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQty,
        clear,
        totalItems,
        totalPrice,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        flyToCart,
        flyingItems,
        removeFlyingItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

