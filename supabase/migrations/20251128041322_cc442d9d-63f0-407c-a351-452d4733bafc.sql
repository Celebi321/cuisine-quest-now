-- Create dishes table to store dish data
CREATE TABLE public.dishes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  time text NOT NULL,
  difficulty text NOT NULL,
  rating numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  calories integer NOT NULL,
  cost_level integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Everyone can view dishes
CREATE POLICY "Anyone can view dishes" 
ON public.dishes 
FOR SELECT 
USING (true);

-- Only authenticated users can insert dishes (for admin upload)
CREATE POLICY "Authenticated users can insert dishes" 
ON public.dishes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update dishes
CREATE POLICY "Authenticated users can update dishes" 
ON public.dishes 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete dishes
CREATE POLICY "Authenticated users can delete dishes" 
ON public.dishes 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_dishes_updated_at
BEFORE UPDATE ON public.dishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();