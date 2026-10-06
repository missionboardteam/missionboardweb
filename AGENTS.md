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
- Leaderboard access exposes only display names and aggregate scores to authenticated users, never private profile fields.
- Keep batch provider URLs in the batch page's shared provider list so server selection and embedded navigation agree.
