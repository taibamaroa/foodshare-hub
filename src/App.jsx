import { useEffect, useState } from "react";
import * as api from "./api.js";

const left = (t) => { const m = Math.max(0, Math.round((t - Date.now()) / 60000)); return `${Math.floor(m / 60)}h ${m % 60}m`; };

function FindFood() {
  const [posts, setPosts] = useState([]), [q, setQ] = useState(""), [msg, setMsg] = useState("");
  const [f, setF] = useState({ title: "", servings: "", area: "", minutes: 120 });
  const load = () => api.getPosts(q).then(setPosts).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  const claim = (id) => api.claimPost(id).then(() => { setMsg("Claimed! Please pick up before the deadline."); load(); }).catch((e) => { setMsg(e.message); load(); });
  const submit = (e) => { e.preventDefault(); api.createPost(f).then(() => { setMsg("Food post published."); setF({ title: "", servings: "", area: "", minutes: 120 }); load(); }).catch((er) => setMsg(er.message)); };
  return (<div className="page">
    <h1>Available food near you</h1>
    <p className="sub">{posts.length} posts · updated just now</p>
    {msg && <div className="note">{msg}</div>}
    <div className="bar"><input placeholder="Search by area or food" value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn" onClick={load}>Search</button></div>
    <div className="grid2"><div>
      {posts.map((p) => (<div key={p.id} className={"card row" + (p.claimed ? " dim" : "")}>
        <div><h3>{p.title}</h3><div className="muted">{p.servings} servings · {p.area} · {p.km} km</div>
          <span className="tag">Expires in {left(p.expiresAt)}</span><div className="muted small">Posted by {p.by}</div></div>
        <button className="btn" disabled={p.claimed} onClick={() => claim(p.id)}>{p.claimed ? "Claimed" : "Claim"}</button>
      </div>))}</div>
      <form className="card" onSubmit={submit}><h3>Post surplus food</h3>
        <input placeholder="Food title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input type="number" placeholder="Servings" value={f.servings} onChange={(e) => setF({ ...f, servings: e.target.value })} />
        <input placeholder="Pickup area" value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} />
        <input type="number" placeholder="Pickup deadline (minutes from now)" value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} />
        <button className="btn">Publish post</button></form>
    </div></div>);
}

function Campaign() {
  const [c, setC] = useState(null), [msg, setMsg] = useState(""), [err, setErr] = useState("");
  const [f, setF] = useState({ amount: 1000, method: "bKash", txid: "", donor: "" });
  const load = () => api.getCampaign().then(setC);
  useEffect(() => { load(); }, []);
  const submit = (e) => { e.preventDefault(); setErr(""); setMsg("");
    api.donate(f).then(() => { setMsg("Donation submitted. It stays Pending until the NGO verifies the TxID."); setF({ ...f, txid: "" }); }).catch((er) => setErr(er.message)); };
  if (!c) return <div className="page">Loading…</div>;
  const pct = Math.round((c.raised / c.goal) * 100);
  return (<div className="page"><div className="grid2">
    <div><span className="tag">{c.ngo} · Verified NGO</span><h1>{c.title}</h1>
      <div className="card"><b className="big">Tk {c.raised.toLocaleString()}</b> <span className="muted">raised of Tk {c.goal.toLocaleString()} goal</span>
        <div className="progress"><div style={{ width: pct + "%" }} /></div>
        <div className="muted">{c.donors} donors · {pct}% funded · {c.daysLeft} days left</div></div>
      <h3>How your donation is used</h3><div className="muted">1. NGO verifies TxID → 2. Food is bought → 3. Proof is uploaded</div></div>
    <form className="card" onSubmit={submit}><h3>Donate to this campaign</h3>
      <div className="chips">{[500, 1000, 2000].map((a) => <button type="button" key={a} className={"chip" + (f.amount === a ? " on" : "")} onClick={() => setF({ ...f, amount: a })}>Tk {a}</button>)}</div>
      <div className="chips">{["bKash", "Nagad"].map((m) => <button type="button" key={m} className={"chip" + (f.method === m ? " on" : "")} onClick={() => setF({ ...f, method: m })}>{m}</button>)}</div>
      <div className="note">1. Send Tk {f.amount} to 01XXXXXXXXX ({c.ngo}). 2. Paste the Transaction ID below.</div>
      <input placeholder="Transaction ID e.g. 9KL3XQ2M8P" value={f.txid} onChange={(e) => setF({ ...f, txid: e.target.value })} />
      <input placeholder="Your name or phone" value={f.donor} onChange={(e) => setF({ ...f, donor: e.target.value })} />
      {err && <div className="err">{err}</div>}{msg && <div className="ok">{msg}</div>}
      <button className="btn">Submit donation</button></form>
  </div></div>);
}

export default function App() {
  const [tab, setTab] = useState("food");
  return (<><header><b className="logo">FoodShare Hub</b>
    <nav><button className={tab === "food" ? "on" : ""} onClick={() => setTab("food")}>Find Food</button>
      <button className={tab === "camp" ? "on" : ""} onClick={() => setTab("camp")}>Campaigns</button></nav></header>
    {tab === "food" ? <FindFood /> : <Campaign />}</>);
}
