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
      
      // Sử dụng database function để lấy điểm tổng hợp (không lộ user_id)
      const { data: statsData, error: statsError } = await supabase
        .rpc("get_dish_rating_stats", { dish_id_param: dishId });

      if (statsError) throw statsError;

      if (statsData && statsData.length > 0) {
        setAverageRating(Number(statsData[0].average_rating) || 0);
        setRatings(new Array(Number(statsData[0].total_ratings) || 0).fill({} as Rating));
      } else {
        setAverageRating(0);
        setRatings([]);
      }

      // Chỉ lấy đánh giá của user hiện tại (RLS đã hạn chế)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRatingData } = await supabase
          .from("dish_ratings")
          .select("rating")
          .eq("dish_id", dishId)
          .eq("user_id", user.id)
          .maybeSingle();
        
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
