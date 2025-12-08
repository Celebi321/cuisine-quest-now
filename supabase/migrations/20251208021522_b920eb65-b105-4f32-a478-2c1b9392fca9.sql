-- Tạo function lấy điểm đánh giá trung bình cho món ăn (không lộ user_id)
CREATE OR REPLACE FUNCTION public.get_dish_rating_stats(dish_id_param text)
RETURNS TABLE(average_rating numeric, total_ratings bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    ROUND(AVG(rating)::numeric, 1) as average_rating, 
    COUNT(*) as total_ratings
  FROM public.dish_ratings
  WHERE dish_id = dish_id_param;
$$;

-- Xóa policy cũ cho phép mọi người xem ratings
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.dish_ratings;

-- Tạo policy mới: chỉ cho phép user xem đánh giá của chính mình
CREATE POLICY "Users can view their own ratings" 
ON public.dish_ratings 
FOR SELECT 
USING (auth.uid() = user_id);