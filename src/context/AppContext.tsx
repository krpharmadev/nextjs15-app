'use client';
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AppContextType {
  user: User | null;
  currency: string;
  router: ReturnType<typeof useRouter>;
  isSeller: boolean;
  setIsSeller: (isSeller: boolean) => void;
  userData: any;
  fetchUserData: () => Promise<void>;
  products: any[];
  fetchProductData: () => Promise<void>;
  cartItems: { [key: string]: number };
  setCartItems: (cartItems: { [key: string]: number }) => void;
  addToCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";
  const router = useRouter();
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(false);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (session?.user?.role === 'seller') {
        setIsSeller(true);
      }

      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${session?.user.id}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId: string) => {
    if (!session?.user) {
      return toast('Please login', {
        icon: '⚠️',
      });
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (session?.user) {
      try {
        await axios.post('/api/cart/update', { cartData }, {
          headers: { Authorization: `Bearer ${session.user.id}` },
        });
        toast.success('Item added to cart');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (session?.user) {
      try {
        await axios.post('/api/cart/update', { cartData }, {
          headers: { Authorization: `Bearer ${session.user.id}` },
        });
        toast.success('Cart Updated');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const value: AppContextType = {
    user: session?.user || null,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};