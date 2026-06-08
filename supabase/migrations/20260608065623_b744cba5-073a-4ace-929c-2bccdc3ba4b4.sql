
-- Admin can manage everyone's user_skills
CREATE POLICY "us_admin_all" ON public.user_skills
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can manage everyone's user_workouts
CREATE POLICY "uw_admin_all" ON public.user_workouts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
