ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

CREATE TABLE public.discussion_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discussion_posts TO authenticated;
GRANT ALL ON public.discussion_posts TO service_role;
ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts readable by authenticated" ON public.discussion_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "users insert own posts" ON public.discussion_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own posts" ON public.discussion_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.discussion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discussion_comments TO authenticated;
GRANT ALL ON public.discussion_comments TO service_role;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments readable by authenticated" ON public.discussion_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "users insert own comments" ON public.discussion_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own comments" ON public.discussion_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.discussion_likes (
  post_id UUID NOT NULL REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.discussion_likes TO authenticated;
GRANT ALL ON public.discussion_likes TO service_role;
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes readable by authenticated" ON public.discussion_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "users insert own likes" ON public.discussion_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own likes" ON public.discussion_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_discussion_comments_post ON public.discussion_comments(post_id);
CREATE INDEX idx_discussion_posts_created ON public.discussion_posts(created_at DESC);