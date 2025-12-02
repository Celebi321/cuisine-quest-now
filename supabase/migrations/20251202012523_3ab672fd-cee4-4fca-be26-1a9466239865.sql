-- Create meal_logs table to track daily meals
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dish_id text NOT NULL,
  dish_title text NOT NULL,
  dish_category text,
  notes text,
  eaten_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own meal logs"
  ON public.meal_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal logs"
  ON public.meal_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal logs"
  ON public.meal_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal logs"
  ON public.meal_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Index for better query performance
CREATE INDEX idx_meal_logs_user_eaten ON public.meal_logs(user_id, eaten_at DESC);

-- Trigger to auto-update created_at
CREATE TRIGGER update_meal_logs_updated_at
  BEFORE UPDATE ON public.meal_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();