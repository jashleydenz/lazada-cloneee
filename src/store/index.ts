import { create } from 'zustand';

interface AuthStore {
  user: any;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: any, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

interface CartStore {
  items: any[];
  total: number;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  setUser: (user, token) => set({ user, token, isLoggedIn: !!token }),
  logout: () => set({ user: null, token: null, isLoggedIn: false }),
  setToken: (token) => set({ token }),
}));

// Helper function to calculate total
const calculateTotal = (items: any[]) => {
  return items.reduce((sum, item) => {
    const price = Number(item.specialPrice || item.price || 0);
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
};

// Helper function to get item ID
const getItemId = (item: any) => item._id || item.id;

// Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const items = JSON.parse(stored);
        return { items, total: calculateTotal(items) };
      } catch (e) {
        return { items: [], total: 0 };
      }
    }
  }
  return { items: [], total: 0 };
};

// Save cart to localStorage
const saveCartToStorage = (items: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

export const useCartStore = create<CartStore>((set) => ({
  ...loadCartFromStorage(),
  addItem: (item) => set((state) => {
    const itemId = getItemId(item);
    const existingItem = state.items.find(i => getItemId(i) === itemId);
    
    let newItems;
    if (existingItem) {
      newItems = state.items.map(i => 
        getItemId(i) === itemId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
      );
    } else {
      newItems = [...state.items, { ...item, quantity: item.quantity || 1 }];
    }
    
    saveCartToStorage(newItems);
    return { items: newItems, total: calculateTotal(newItems) };
  }),
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter(i => getItemId(i) !== id);
    saveCartToStorage(newItems);
    return { items: newItems, total: calculateTotal(newItems) };
  }),
  updateQuantity: (id, quantity) => set((state) => {
    const newItems = state.items.map(i => getItemId(i) === id ? { ...i, quantity } : i);
    saveCartToStorage(newItems);
    return { items: newItems, total: calculateTotal(newItems) };
  }),
  clearCart: () => {
    saveCartToStorage([]);
    return { items: [], total: 0 };
  },
}));
