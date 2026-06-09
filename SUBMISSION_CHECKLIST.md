# Submission Checklist

- Run `npm run lint` from the repository root.
- Run `npm run build` from the repository root.
- Add real MongoDB values to `server/.env`.
- Run `npm run seed`.
- Start backend with `npm run dev --prefix server`.
- Start frontend with `npm run dev --prefix client`.
- Verify register, login, search, filters, video player, like/dislike, comments, and channel video CRUD.
- Confirm CSS uses only `rgb(...)` or `rgba(...)` colors.
- Confirm no `node_modules` folders are submitted.
- Confirm the GitHub repository has 45 or more meaningful commits after the final polish pass.
- Run `git log --oneline --max-count=20` to review the newest commits.
- Run `git remote -v` to confirm the repository points to the correct GitHub URL.
- Push the final branch with `git push origin main`.
