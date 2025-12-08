-- Drop existing policies for INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Authenticated users can insert dishes" ON public.dishes;
DROP POLICY IF EXISTS "Authenticated users can update dishes" ON public.dishes;
DROP POLICY IF EXISTS "Authenticated users can delete dishes" ON public.dishes;

-- Create new policies using has_role function for admin-only access
CREATE POLICY "Only admins can insert dishes" 
ON public.dishes 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update dishes" 
ON public.dishes 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete dishes" 
ON public.dishes 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));