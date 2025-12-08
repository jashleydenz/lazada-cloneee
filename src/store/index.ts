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

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i._id === item._id);
    if (existingItem) {
      return {
        items: state.items.map(i => 
          i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i._id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i._id === id ? { ...i, quantity } : i),
  })),
  clearCart: () => set({ items: [], total: 0 }),
}));
