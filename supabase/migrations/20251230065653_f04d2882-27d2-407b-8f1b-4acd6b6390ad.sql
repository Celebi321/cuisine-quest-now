-- Tạo function để lấy bình luận công khai (không có user_id)
CREATE OR REPLACE FUNCTION public.get_public_comments(dish_id_param text)
RETURNS TABLE (
  id uuid,
  dish_id text,
  comment text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT id, dish_id, comment, created_at
  FROM public.dish_comments
  WHERE dish_id = dish_id_param
  ORDER BY created_at DESC;
$$;