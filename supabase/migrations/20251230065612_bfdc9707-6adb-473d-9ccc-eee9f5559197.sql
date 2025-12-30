-- Tạo lại view với SECURITY INVOKER (mặc định an toàn hơn)
DROP VIEW IF EXISTS public.dish_comments_public;

CREATE VIEW public.dish_comments_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  dish_id,
  comment,
  created_at
FROM public.dish_comments;

-- Cho phép mọi người đọc view
GRANT SELECT ON public.dish_comments_public TO anon, authenticated;