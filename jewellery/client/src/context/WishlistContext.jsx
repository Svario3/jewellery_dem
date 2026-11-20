import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast, addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      const saved = localStorage.getItem('aurelia_guest_wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await wishlistAPI.get();
      if (res.data.success && res.data.wishlist) {
        setWishlist(res.data.wishlist.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const res = await wishlistAPI.toggle(product._id);
        if (res.data.success) {
          setWishlist(res.data.wishlist.products || []);
          showToast(res.data.message);
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error updating wishlist');
      }
    } else {
      const exists = wishlist.some((p) => (p._id || p) === product._id);
      let updated;
      if (exists) {
        updated = wishlist.filter((p) => (p._id || p) !== product._id);
        showToast(`Removed from your wishlist.`);
      } else {
        updated = [...wishlist, product];
        showToast(`Saved "${product.name}" to your wishlist.`);
      }
      setWishlist(updated);
      localStorage.setItem('aurelia_guest_wishlist', JSON.stringify(updated));
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((p) => (p._id || p) === productId);
  };

  const moveToBag = async (product) => {
    if (user) {
      try {
        await wishlistAPI.moveToCart({ productId: product._id });
        await fetchWishlist();
        addToCart(product, 1);
        showToast(`Moved "${product.name}" to your Shopping Bag.`);
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to move to bag');
      }
    } else {
      toggleWishlist(product);
      addToCart(product, 1);
      showToast(`Moved "${product.name}" to your Shopping Bag.`);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isWishlisted,
        moveToBag,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
