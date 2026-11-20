import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    shippingFee: 0,
    taxAmount: 0,
    coupon: { code: null, discountPercent: 0, discountAmount: 0 },
    totalAmount: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync cart from server when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Guest cart stored in localStorage
      const savedCart = localStorage.getItem('aurelia_guest_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCart({
          items: [],
          subtotal: 0,
          shippingFee: 0,
          taxAmount: 0,
          coupon: { code: null, discountPercent: 0, discountAmount: 0 },
          totalAmount: 0,
        });
      }
    }
  }, [user]);

  const recalculateGuestCart = (items, coupon = null) => {
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    const shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    const taxAmount = Math.round(subtotal * 0.03);
    let discountAmount = 0;
    if (coupon && coupon.code) {
      if (coupon.discountPercent) discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
      else if (coupon.discountAmount) discountAmount = coupon.discountAmount;
    }
    const totalAmount = Math.max(0, subtotal + shippingFee + taxAmount - discountAmount);
    return {
      items,
      subtotal,
      shippingFee,
      taxAmount,
      coupon: coupon || { code: null, discountPercent: 0, discountAmount: 0 },
      totalAmount,
    };
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await cartAPI.get();
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, selectedVariant = 'Default') => {
    if (user) {
      try {
        setLoading(true);
        const res = await cartAPI.add({
          productId: product._id,
          quantity,
          selectedVariant,
        });
        if (res.data.success) {
          setCart(res.data.cart);
          showToast(`Added "${product.name}" to your shopping bag.`);
          setIsCartOpen(true);
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to add item to bag');
      } finally {
        setLoading(false);
      }
    } else {
      // Guest addition
      const currentItems = [...cart.items];
      const existingIdx = currentItems.findIndex(
        (i) => (i.product._id || i.product) === product._id && i.selectedVariant === selectedVariant
      );

      if (existingIdx > -1) {
        currentItems[existingIdx].quantity += quantity;
      } else {
        currentItems.push({
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images,
            stock: product.stock,
            metalType: product.metalType,
            purity: product.purity,
            sku: product.sku,
          },
          quantity,
          selectedVariant,
          price: product.price,
        });
      }

      const updated = recalculateGuestCart(currentItems, cart.coupon);
      setCart(updated);
      localStorage.setItem('aurelia_guest_cart', JSON.stringify(updated));
      showToast(`Added "${product.name}" to your shopping bag.`);
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        const res = await cartAPI.updateItem(itemId, { quantity });
        if (res.data.success) {
          setCart(res.data.cart);
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error updating item quantity');
      }
    } else {
      let currentItems = [...cart.items];
      if (quantity <= 0) {
        currentItems = currentItems.filter((_, idx) => idx !== itemId && (item => item._id !== itemId));
      } else {
        const idx = currentItems.findIndex((it, i) => it._id === itemId || i === itemId);
        if (idx > -1) currentItems[idx].quantity = quantity;
      }
      const updated = recalculateGuestCart(currentItems, cart.coupon);
      setCart(updated);
      localStorage.setItem('aurelia_guest_cart', JSON.stringify(updated));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const res = await cartAPI.removeItem(itemId);
        if (res.data.success) {
          setCart(res.data.cart);
          showToast('Item removed from bag');
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Error removing item');
      }
    } else {
      const currentItems = cart.items.filter((it, idx) => it._id !== itemId && idx !== itemId);
      const updated = recalculateGuestCart(currentItems, cart.coupon);
      setCart(updated);
      localStorage.setItem('aurelia_guest_cart', JSON.stringify(updated));
      showToast('Item removed from bag');
    }
  };

  const applyCoupon = async (code) => {
    if (user) {
      try {
        const res = await cartAPI.applyCoupon(code);
        if (res.data.success) {
          setCart(res.data.cart);
          showToast(res.data.message);
          return { success: true, message: res.data.message };
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid promotional voucher code';
        showToast(msg);
        return { success: false, message: msg };
      }
    } else {
      const clean = code.trim().toUpperCase();
      let couponData = null;
      if (clean === 'AURELIA10') couponData = { code: 'AURELIA10', discountPercent: 10, discountAmount: 0 };
      else if (clean === 'BRIDAL5000' && cart.subtotal >= 40000) couponData = { code: 'BRIDAL5000', discountPercent: 0, discountAmount: 5000 };
      else if (clean === 'FIRSTGOLD') couponData = { code: 'FIRSTGOLD', discountPercent: 5, discountAmount: 0 };
      else {
        showToast('Invalid coupon code. Try AURELIA10 for 10% off.');
        return { success: false, message: 'Invalid coupon code' };
      }

      const updated = recalculateGuestCart(cart.items, couponData);
      setCart(updated);
      localStorage.setItem('aurelia_guest_cart', JSON.stringify(updated));
      showToast(`Promotional voucher ${clean} applied!`);
      return { success: true, message: `Voucher ${clean} applied!` };
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartAPI.clear();
      } catch (err) {
        console.error(err);
      }
    }
    const cleared = {
      items: [],
      subtotal: 0,
      shippingFee: 0,
      taxAmount: 0,
      coupon: { code: null, discountPercent: 0, discountAmount: 0 },
      totalAmount: 0,
    };
    setCart(cleared);
    localStorage.removeItem('aurelia_guest_cart');
  };

  const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalCount,
        loading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        clearCart,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
