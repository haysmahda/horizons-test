
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('travelexp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('travelexp_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (activity, quantity = 1, selectedDate = null) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === activity.id && item.selectedDate === selectedDate);
      if (existing) {
        return prev.map(item =>
          item.id === activity.id && item.selectedDate === selectedDate
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...activity, quantity, selectedDate }];
    });
  };

  const removeItem = (id, selectedDate = null) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.selectedDate === selectedDate)));
  };

  const updateQuantity = (id, quantity, selectedDate = null) => {
    if (quantity <= 0) {
      removeItem(id, selectedDate);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedDate === selectedDate ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
