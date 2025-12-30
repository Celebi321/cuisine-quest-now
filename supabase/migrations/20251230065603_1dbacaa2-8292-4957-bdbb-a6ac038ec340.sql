-- Tạo view công khai chỉ hiển thị nội dung bình luận (không có user_id)
CREATE OR REPLACE VIEW public.dish_comments_public AS
SELECT 
  id,
  dish_id,
  comment,
  created_at
FROM public.dish_comments;

-- Cho phép mọi người đọc view công khai
GRANT SELECT ON public.dish_comments_public TO anon, authenticated;

-- Cập nhật policy: Chỉ authenticated users mới xem được bảng gốc (để quản lý comments của mình)
DROP POLICY IF EXISTS "Anyone can view comments" ON public.dish_comments;

CREATE POLICY "Authenticated users can view all comments" 
ON public.dish_comments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);