import express from "express";
export const app = express();
app.use(express.json());

const now = Date.now(), min = (m) => now + m * 60000;
let posts = [
  { id: 1, title: "Wedding biryani & chicken roast", servings: 60, area: "Mirpur 10", km: 1.2, by: "Royal Convention Hall", type: "Cooked meal", expiresAt: min(130), claimed: false },
  { id: 2, title: "Restaurant rice, dal & curry", servings: 25, area: "Mirpur 2", km: 2.8, by: "Kacchi Corner", type: "Cooked meal", expiresAt: min(220), claimed: false },
  { id: 3, title: "Hostel dinner (rice & egg curry)", servings: 40, area: "Kazipara", km: 3.1, by: "Green View Hostel", type: "Cooked meal", expiresAt: min(65), claimed: true },
];
let campaign = { id: 1, title: "Iftar for 200 people – Kamalapur", ngo: "Hope Food Bank", verified: true, raised: 31000, goal: 50000, donors: 126, daysLeft: 6 };
let donations = [];

app.get("/api/posts", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const list = posts.filter((p) => p.expiresAt > Date.now() && (p.title + p.area).toLowerCase().includes(q))
    .sort((a, b) => a.expiresAt - b.expiresAt);
  res.json(list);
});
app.post("/api/posts", (req, res) => {
  const { title, servings, area, minutes } = req.body;
  if (!title || !servings || !area) return res.status(400).json({ error: "title, servings, area required" });
  const p = { id: Date.now(), title, servings: +servings, area, km: 1.0, by: "You", type: "Cooked meal", expiresAt: Date.now() + (+minutes || 120) * 60000, claimed: false };
  posts.push(p); res.status(201).json(p);
});
app.post("/api/posts/:id/claim", (req, res) => {
  const p = posts.find((x) => x.id === +req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  if (p.claimed) return res.status(409).json({ error: "Already claimed by another volunteer" });
  p.claimed = true; res.json(p);
});
app.get("/api/campaign", (_req, res) => res.json(campaign));
app.post("/api/donations", (req, res) => {
  const { amount, method, txid, donor } = req.body;
  if (!amount || !txid || !donor) return res.status(400).json({ error: "amount, txid, donor required" });
  if (donations.some((d) => d.txid === txid)) return res.status(409).json({ error: "This TxID was already submitted" });
  const d = { id: donations.length + 1, amount: +amount, method, txid, donor, status: "Pending" };
  donations.push(d); res.status(201).json(d);
});
export default app;
