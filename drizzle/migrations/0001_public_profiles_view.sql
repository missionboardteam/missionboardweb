CREATE VIEW public.public_profiles AS
SELECT id, full_name, class FROM public.profiles;
GRANT SELECT ON public.public_profiles TO authenticated;