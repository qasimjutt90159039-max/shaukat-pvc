import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'shaukat_wishlist_ids';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      // Fetch user's wishlist from DB
      apiFetch<Array<{ id: string }>>('/wishlist')
        .then((products) => {
          const ids = products.map((p) => p.id);
          setWishlistIds(ids);
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
        })
        .catch(() => {});
    }
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    const isCurrentlySaved = wishlistIds.includes(productId);
    const updated = isCurrentlySaved
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    setWishlistIds(updated);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));

    if (user) {
      try {
        await apiFetch('/wishlist/toggle', {
          method: 'POST',
          body: JSON.stringify({ productId }),
        });
      } catch (err) {
        console.error('Failed to sync wishlist with server', err);
      }
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
