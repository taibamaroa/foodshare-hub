async function call(url, opts) {
  const r = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Request failed");
  return data;
}
const post = (url, body) => call(url, { method: "POST", body: JSON.stringify(body) });
export const getPosts = (q = "") => call(`/api/posts?q=${encodeURIComponent(q)}`);
export const createPost = (b) => post("/api/posts", b);
export const claimPost = (id) => post(`/api/posts/${id}/claim`, {});
export const getCampaign = () => call("/api/campaign");
export const donate = (b) => post("/api/donations", b);
