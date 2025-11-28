import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { allDishes } from "@/lib/dishesData";
import type { Dish } from "@/lib/dishesData";

export const useDishes = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dishes:", error);
        // Fallback to static data if database fetch fails
        return allDishes;
      }

      // If no dishes in database, use static data
      if (!data || data.length === 0) {
        return allDishes;
      }

      // Transform database data to match Dish type
      const dbDishes: Dish[] = data.map((dish) => ({
        id: dish.id,
        title: dish.title,
        image: dish.image,
        description: dish.description,
        tags: dish.tags as any[],
        time: dish.time,
        difficulty: dish.difficulty,
        rating: Number(dish.rating),
        category: dish.category,
        calories: dish.calories,
        costLevel: dish.cost_level === 1 ? "low" : dish.cost_level === 2 ? "mid" : "high",
        lastEaten: undefined,
        favorite: false,
      }));

      // Combine database dishes with static dishes
      return [...dbDishes, ...allDishes];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
