CREATE TABLE public.daily_practice_attempts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 practice_date date NOT NULL,
 subject text NOT NULL CHECK (subject IN ('english','maths','science','social')),
 answers jsonb NOT NULL,
 score integer NOT NULL CHECK (score BETWEEN 0 AND 50 AND score % 5 = 0),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (user_id, practice_date, subject)
);
GRANT SELECT ON public.daily_practice_attempts TO authenticated;
GRANT ALL ON public.daily_practice_attempts TO service_role;
ALTER TABLE public.daily_practice_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own practice attempts" ON public.daily_practice_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.daily_practice_leaderboard()
RETURNS TABLE (user_id uuid, display_name text, total_points bigint, subjects_completed bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
 SELECT a.user_id, coalesce(nullif(trim(p.full_name), ''), 'Mission Board Student'), sum(a.score), count(*)
 FROM public.daily_practice_attempts a LEFT JOIN public.profiles p ON p.id = a.user_id
 GROUP BY a.user_id, p.full_name ORDER BY sum(a.score) DESC, count(*) DESC, a.user_id LIMIT 50;
$$;
REVOKE ALL ON FUNCTION public.daily_practice_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.daily_practice_leaderboard() TO authenticated;