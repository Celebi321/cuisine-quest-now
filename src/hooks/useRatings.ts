import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Rating {
  id: string;
  user_id: string;
  dish_id: string;
  rating: number;
  created_at: string;
}

export const useRatings = (dishId: string) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRatings();
  }, [dishId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("dish_ratings")
        .select("*")
        .eq("dish_id", dishId);

      if (error) throw error;

      setRatings(data || []);
      
      // Calculate average
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }

      // Check if current user has rated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userRatingData = data?.find(r => r.user_id === user.id);
        setUserRating(userRatingData?.rating || null);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Vui lòng đăng nhập",
          description: "Bạn cần đăng nhập để đánh giá món ăn",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("dish_ratings")
        .upsert({
          user_id: user.id,
          dish_id: dishId,
          rating: rating,
        });

      if (error) throw error;

      setUserRating(rating);
      await fetchRatings();
      
      toast({
        title: "Đánh giá thành công!",
        description: "Cảm ơn bạn đã đánh giá món ăn",
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi đánh giá",
        variant: "destructive",
      });
    }
  };

  return {
    ratings,
    userRating,
    averageRating,
    totalRatings: ratings.length,
    loading,
    submitRating,
    refetch: fetchRatings,
  };
};
