import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const FAVORITES_KEY = "homNayAnGi_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load favorites from localStorage or database
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      
      if (user) {
        // Load from database when logged in
        const { data, error } = await supabase
          .from("favorites")
          .select("item_id")
          .eq("user_id", user.id);
        
        if (!error && data) {
          const dbFavorites = data.map((f) => f.item_id);
          setFavorites(dbFavorites);
          // Also update localStorage as cache
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(dbFavorites));
        }
      } else {
        // Load from localStorage when not logged in
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          try {
            setFavorites(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse favorites", e);
          }
        }
      }
      
      setIsLoading(false);
    };

    loadFavorites();
  }, [user]);

  // Sync localStorage favorites to database when user logs in
  useEffect(() => {
    const syncToDatabase = async () => {
      if (!user) return;
      
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (!stored) return;
      
      try {
        const localFavorites = JSON.parse(stored) as string[];
        if (localFavorites.length === 0) return;
        
        // Get existing favorites from database
        const { data: existingData } = await supabase
          .from("favorites")
          .select("item_id")
          .eq("user_id", user.id);
        
        const existingIds = new Set(existingData?.map((f) => f.item_id) || []);
        
        // Insert only new favorites
        const newFavorites = localFavorites.filter((id) => !existingIds.has(id));
        
        if (newFavorites.length > 0) {
          await supabase.from("favorites").insert(
            newFavorites.map((item_id) => ({
              user_id: user.id,
              item_id,
            }))
          );
        }
      } catch (e) {
        console.error("Failed to sync favorites", e);
      }
    };

    syncToDatabase();
  }, [user]);

  const toggleFavorite = useCallback(async (dishId: string) => {
    const isFav = favorites.includes(dishId);
    
    // Optimistic update
    const newFavorites = isFav
      ? favorites.filter((id) => id !== dishId)
      : [...favorites, dishId];
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    // Sync to database if logged in
    if (user) {
      if (isFav) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", dishId);
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          item_id: dishId,
        });
      }
    }
  }, [favorites, user]);

  const isFavorite = useCallback((dishId: string) => favorites.includes(dishId), [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoading };
};
