CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'general',
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed in users can read notifications" ON public.notifications FOR SELECT TO authenticated USING (true);

INSERT INTO public.notifications (title, body, channel, link) VALUES
('Welcome to the new website!', 'Mission Board Class 10 2027 presents a brand new website with all channels, FAQs and updates in one place.', 'general', NULL),
('Class 10 sample papers uploaded', 'Fresh CBSE 2027 pattern sample papers with solutions are now available on the Mission Board channel.', 'Mission Board Class 10 2027', 'https://t.me/+T8PdqiLKkfU1ZDU9'),
('Doubt sessions are live', 'Ask your Class 10 doubts anytime in the discussion group — students and mentors reply daily.', 'Class 10 Discussion Group', 'https://t.me/+AxCXqeqCM-JiYTc1'),
('New PCM & PCB notes', 'Next Generation Academy has added new Physics, Chemistry, Maths and Biology notes for Class 11 and 12.', 'Next Generation Academy', 'https://t.me/NextGenerationAcademy07');