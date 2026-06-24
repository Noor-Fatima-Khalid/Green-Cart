import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  // FIX: consistent initial states
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- FETCH SELLER ----------------
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(!!data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch {
      setUser(null);
      setCartItems({});
    }
  };

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
    console.log("API response:", data);
      if (data.success) {
      console.log("Products:", data.products);
      setProducts(data.products || []);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log("Fetch error:", error);
    toast.error(error.message);
  }
};

  // ---------------- CART ACTIONS ----------------
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems || {});

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    setCartItems(cartData);
    toast.success("Added To Cart");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems || {});

    if (!cartData[itemId]) return;

    cartData[itemId] -= 1;

    if (cartData[itemId] <= 0) {
      delete cartData[itemId];
    }

    setCartItems(cartData);
    toast.success("Removed from cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems || {});
    cartData[itemId] = quantity;

    if (quantity <= 0) {
      delete cartData[itemId];
    }

    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // ---------------- CART TOTAL COUNT ----------------
  const getCartCount = () => {
    return Object.values(cartItems || {}).reduce(
      (total, qty) => total + qty,
      0
    );
  };

  // ---------------- CART AMOUNT (FIXED CRASH BUG) ----------------
  const getCartAmount = () => {
    if (!products || products.length === 0) return 0;

    let totalAmount = 0;

    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);

      if (product && cartItems[itemId] > 0) {
        totalAmount += product.offerPrice * cartItems[itemId];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ---------------- SYNC CART TO DB ----------------
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          cartItems,
        });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]);

  // ---------------- CONTEXT VALUE ----------------
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    addToCart,
    removeFromCart,
    updateCartItem,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    fetchUser,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);