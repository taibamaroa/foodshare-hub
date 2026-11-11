# FoodShare Hub (Mid-progress prototype)
Pages: Find Food (list/search/claim/post) and Campaign (donate via bKash/Nagad TxID).
## Run
1. Install Node.js LTS from nodejs.org
2. `npm install`
3. `npm run dev`  -> open http://localhost:5173
(API runs on :4000, data resets when the server restarts)
## Deploy
Vercel/Netlify host only the frontend; the Express API needs a host like Render, or use `npm run build` for screenshots/demo locally.
