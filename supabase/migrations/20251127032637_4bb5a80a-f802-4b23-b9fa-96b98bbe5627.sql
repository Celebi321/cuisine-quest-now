-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create ratings table
CREATE TABLE public.dish_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dish_id)
);

-- Create comments table
CREATE TABLE public.dish_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dish_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ratings
CREATE POLICY "Anyone can view ratings"
ON public.dish_ratings
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own ratings"
ON public.dish_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.dish_ratings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
ON public.dish_ratings
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments"
ON public.dish_comments
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own comments"
ON public.dish_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.dish_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.dish_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updating timestamps
CREATE TRIGGER update_dish_ratings_updated_at
BEFORE UPDATE ON public.dish_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dish_comments_updated_at
BEFORE UPDATE ON public.dish_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();