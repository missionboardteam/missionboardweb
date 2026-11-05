<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Daily practice uses a server-only question bank and India-local dates so answers stay private and daily sets reset consistently.
- Grade practice submissions on the authenticated server and allow only a privileged insert into score rows; a unique user/date/subject key prevents duplicate scoring.
- Use shared word-count validation for mixed written/MCQ practice answers and private server-side key-point rubrics for written grading; answer length alone must not earn points.
- Leaderboard access exposes only display names and aggregate scores to authenticated users, never private profile fields.
- Keep batch provider URLs in the batch page's shared provider list so server selection and embedded navigation agree.
- The liquid-glass design system lives in src/styles.css (glass-panel/glass-chip/shine-sweep utilities, mb-* keyframes); the site-wide floating decor layer is src/components/FloatingGlassAssets.tsx mounted in __root, and its intensity follows the frosted↔liquid slider via useGlass.
