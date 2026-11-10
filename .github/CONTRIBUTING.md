# Team Workflow

## Rules
1. Never commit directly to `main`.
2. Work only on your own branch: `dev-yourname`.
3. Never commit `.env.local` or any keys.
4. Compress images and videos before adding them (under 2 MB each).

## First-time setup
git clone https://github.com/Nikhileswar2007/hackathon-site.git
cd hackathon-site
npm install
(copy .env.example to .env.local and ask for the keys)
git switch -c dev-yourname
npm run dev

## Every session
git switch dev-yourname
git pull origin main
(code)
git add .
git commit -m "feat: short description"
git push -u origin dev-yourname

## Submit work
On GitHub: Compare & pull request, base = main, compare = your branch.

## Folder ownership
- Frontend (Nikhil): src/app pages, src/app/components
- Backend: src/app/api, src/lib, supabase/