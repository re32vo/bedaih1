import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  title: string;
  description: string;
  image: string;
  amount: number;
  donationType: 'single' | 'quick' | 'recurring';
  paymentMethod?: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, amount: number) => void;
  updateQuantity: (id: string, amount: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bedaih-cart');
    if (!saved) return [];
    
    const loadedItems: CartItem[] = JSON.parse(saved);
    
    // دمج العناصر المتشابهة
    const mergedItems: CartItem[] = [];
    loadedItems.forEach(item => {
      const existingIndex = mergedItems.findIndex(
        existing => 
          existing.id === item.id && 
          existing.amount === item.amount && 
          existing.donationType === item.donationType
      );
      
      if (existingIndex > -1) {
        mergedItems[existingIndex].quantity += item.quantity;
      } else {
        mergedItems.push({ ...item });
      }
    });
    
    return mergedItems;
  });

  useEffect(() => {
    localStorage.setItem('bedaih-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => 
          item.id === newItem.id && 
          item.amount === newItem.amount && 
          item.donationType === newItem.donationType
      );
      
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }
      
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string, amount: number) => {
    setItems((currentItems) => 
      currentItems.filter((item) => !(item.id === id && item.amount === amount))
    );
  };

  const updateQuantity = (id: string, amount: number, quantity: number) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => !(item.id === id && item.amount === amount));
      }
      
      return currentItems.map((item) =>
        item.id === id && item.amount === amount ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => setItems([]);

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

  const getTotalAmount = () => items.reduce((total, item) => total + (item.amount * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      getTotalItems, 
      getTotalAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

