import { useState, useEffect } from "react";

const FAVORITES_KEY = "homNayAnGi_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (dishId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (dishId: string) => favorites.includes(dishId);

  return { favorites, toggleFavorite, isFavorite };
};
