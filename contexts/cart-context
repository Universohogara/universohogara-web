"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Define la estructura básica de un item en el carrito
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Define la estructura de lo que el Contexto va a proveer
interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

// Valor por defecto (usado antes de que el proveedor se monte, solo para inicialización)
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Proveedor principal del contexto del carrito de compras (Cart Provider).
 * Este componente maneja el estado del carrito, incluyendo añadir, eliminar y
 * actualizar la cantidad de productos. Usa localStorage para la persistencia.
 * * NOTA: Esta capa solo maneja el estado *local* del carrito; la integración con
 * Stripe/PayPal se realiza en los archivos de la API de checkout (e.g., /api/checkout).
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Inicializa el estado leyendo de localStorage si existe
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('hogara_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hogara_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Funciones de utilidad y cómputo de totales (usamos useMemo para optimización)
  const totalItems = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const totalAmount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0), 
    [cartItems]
  );


  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        // Si el ítem ya existe, solo actualiza la cantidad
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // Si es un ítem nuevo, añádelo
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item))
        .filter((item) => item.quantity > 0) // Elimina si la cantidad es 0 (o menos, aunque se limita a 1)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const contextValue = useMemo(() => ({
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
  }), [cartItems, totalItems, totalAmount]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto del carrito.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // Es un error común intentar usar un contexto fuera de su proveedor.
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
