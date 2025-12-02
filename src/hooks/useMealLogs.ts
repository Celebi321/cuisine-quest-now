import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface MealLog {
  id: string;
  user_id: string;
  dish_id: string;
  dish_title: string;
  dish_category: string | null;
  notes: string | null;
  eaten_at: string;
  created_at: string;
}

export const useMealLogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch meal logs for today
  const { data: todayMeals = [], isLoading } = useQuery({
    queryKey: ["meal-logs", "today", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("eaten_at", today.toISOString())
        .order("eaten_at", { ascending: false });

      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!user,
  });

  // Fetch all meal logs
  const { data: allMeals = [] } = useQuery({
    queryKey: ["meal-logs", "all", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("eaten_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!user,
  });

  // Add meal log
  const addMeal = useMutation({
    mutationFn: async ({
      dish_id,
      dish_title,
      dish_category,
      notes,
    }: {
      dish_id: string;
      dish_title: string;
      dish_category?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("meal_logs")
        .insert({
          user_id: user.id,
          dish_id,
          dish_title,
          dish_category: dish_category || null,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
      toast.success("Đã thêm món vào hôm nay!");
    },
    onError: (error) => {
      toast.error("Không thể thêm món: " + error.message);
    },
  });

  // Update meal log
  const updateMeal = useMutation({
    mutationFn: async ({
      id,
      notes,
    }: {
      id: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("meal_logs")
        .update({ notes: notes || null })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
      toast.success("Đã cập nhật ghi chú!");
    },
    onError: (error) => {
      toast.error("Không thể cập nhật: " + error.message);
    },
  });

  // Delete meal log
  const deleteMeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meal_logs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-logs"] });
      toast.success("Đã xóa món!");
    },
    onError: (error) => {
      toast.error("Không thể xóa: " + error.message);
    },
  });

  return {
    todayMeals,
    allMeals,
    isLoading,
    addMeal: addMeal.mutate,
    updateMeal: updateMeal.mutate,
    deleteMeal: deleteMeal.mutate,
    isAddingMeal: addMeal.isPending,
  };
};
