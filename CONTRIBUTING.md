# Team Workflow

## Rules
1. Never commit directly to `main`.
2. Work only on your own branch: `dev-yourname`.
3. Never commit `.env.local` or any keys or passwords.
4. Compress images and videos before adding them (under 2 MB each).
5. Use commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`.

## First-time setup
git clone https://github.com/Nikhileswar2007/hackathon-site.git
cd hackathon-site
npm install
Copy .env.example to .env.local and ask the maintainer for the keys.
git config --global pull.rebase false
git switch -c dev-yourname
npm run dev

## Every working session
git switch dev-yourname
git pull origin main
(write code)
git add .
git commit -m "feat: short description"
git push -u origin dev-yourname

## Submit your work
On GitHub click "Compare & pull request". Base = main, compare = your branch. Fill in the template and create it. The maintainer reviews and merges.

## After a merge
Everyone runs: git pull origin main (while on their own branch).

## Folder ownership (to avoid merge conflicts)
- Frontend (Nikhil): app/ pages and app/components/
- Backend: app/api/ and lib/

## Merge conflicts
VS Code shows "Resolve in Merge Editor". Pick the lines to keep, save, then commit.
