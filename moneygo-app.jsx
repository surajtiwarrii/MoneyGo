import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  MoneyGo — User App Shell (v5)                                      */
/*                                                                     */
/*  Fixes in this pass:                                                */
/*   - Home no longer shows any wallet amount/section — wallet lives   */
/*     only in its own tab                                             */
/*   - Email verification is a real send-link → click-link → redirect  */
/*     flow (token read from the URL on load); email + DOB lock once   */
/*     saved, matching how mobile is already locked                   */
/*   - Profile strength is computed from what's actually filled in,    */
/*     not hard-coded                                                  */
/*   - Icon buttons get tactile press feedback; the drawer's close     */
/*     button gets its own hover/press rotation                        */
/*   - Clicking an offer's name in "Offers to share" opens who-did-    */
/*     what-when activity for that specific offer                      */
/*                                                                     */
/*  Admin panel is a separate application — not part of this file.     */
/* ------------------------------------------------------------------ */

const T = {
  ivory: "#FBFAF7",
  paper: "#F3F1EC",
  ink: "#191C1A",
  inkSoft: "#5C615E",
  line: "#E4E1D9",
  green: "#0F4D3A",
  greenDeep: "#0A3628",
  gold: "#B98A2F",
  red: "#9C3A2E",
};

/* ----------------------------- Icons ------------------------------ */

const Icon = {
  Home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 20.5v-6h5v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Wallet: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="14" r="1.2" fill="currentColor" />
    </svg>
  ),
  Share: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="5.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="18.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.4 10.8l6.7-4M8.4 13.2l6.7 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6.5 10.2c0-3 2.5-5.4 5.5-5.4s5.5 2.4 5.5 5.4c0 3.9 1.1 5.3 1.9 6.1H4.6c.8-.8 1.9-2.2 1.9-6.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.8 19a2.3 2.3 0 0 0 4.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Invest: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 17.5 9 11l4 4 8-8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6.5h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Kyc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 16c.5-1.4 1.7-2.2 3-2.2s2.5.8 3 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14.5 9.5h4M14.5 12.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="2.5" y="7" width="19" height="10.5" rx="5.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5v3.5M6.25 12.25h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15.4" cy="11" r="1" fill="currentColor" />
      <circle cx="17.8" cy="13.4" r="1" fill="currentColor" />
    </svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Back: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M16 10H5M9 5.5 4.5 10 9 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M10 2.2 16 4.5v4.6c0 4-2.6 6.7-6 8.2-3.4-1.5-6-4.2-6-8.2V4.5L10 2.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m7.4 9.8 1.9 1.9 3.4-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  CreditIn: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6.5v7M7 10.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 22 22" fill="none" {...p}>
      <circle cx="11" cy="7.6" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 18.2c1.1-3 3.6-4.5 6.5-4.5s5.4 1.5 6.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Pencil: (p) => (
    <svg viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M10.6 2.6 13.4 5.4 5.6 13.2 2.4 13.6l.4-3.2 7.8-7.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  Link: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M8.3 11.7 11.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.4 6.2 11 4.6a3.2 3.2 0 0 1 4.5 4.5l-1.6 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.6 13.8 9 15.4a3.2 3.2 0 0 1-4.5-4.5l1.6-1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Copy: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <rect x="7.5" y="7.5" width="9" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 12.5v-6A2 2 0 0 1 6.5 4.5h6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M3.5 8.3 6.4 11.2 12.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <rect x="3" y="4.5" width="14" height="11" rx="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 5.5 10 11l6.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Gift: (p) => (
    <svg viewBox="0 0 22 22" fill="none" {...p}>
      <rect x="3.5" y="8.5" width="15" height="10" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 12h15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 8.5v10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 8.5c0-2 -1.6-3.4-3.2-3.4S5 6 5.6 7.5C6.1 8.7 8 8.5 11 8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 8.5c0-2 1.6-3.4 3.2-3.4S17 6 16.4 7.5C15.9 8.7 14 8.5 11 8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 22 22" fill="none" {...p}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12.5" y="3.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.5" y="12.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12.5" y="12.5" width="6" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Comment: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M3.5 5.5h13v8h-6.2L6.5 16v-2.5h-3v-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M6 3.5 8.3 6l-1.6 2.2c.8 1.9 2.2 3.3 4.1 4.1L13 10.7l2.5 2.3v2.5c-5.6.7-11-4.7-10.3-10.3H6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Doc: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M6 3.5h6l3 3v10H6v-13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.2 9h4.2M8.2 12h4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <rect x="5" y="9" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 9V6.8a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  LogOut: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M8 3.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13 13.5 16.5 10 13 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
};

/* --------------------------- Utilities ---------------------------- */

const inr = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function formatPhone(p) {
  if (!p || p.length !== 10) return p || "";
  return `${p.slice(0, 5)} ${p.slice(5)}`;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ------------------------- Guilloché art --------------------------- */

function Guilloche({ tone = "line" }) {
  const rings = Array.from({ length: 9 }, (_, i) => 38 + i * 16);
  const stroke = tone === "line" ? T.line : "#DCE8E0";
  return (
    <svg aria-hidden="true" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: tone === "light" ? 0.16 : 0.5 }}>
      {(tone === "light"
        ? [{ cx: 330, cy: 30 }, { cx: 40, cy: 185 }]
        : [{ cx: 340, cy: 20 }]
      ).map((c, ci) =>
        rings.map((r, i) => (
          <ellipse key={`${ci}-${i}`} cx={c.cx} cy={c.cy} rx={r} ry={r * 0.6} fill="none" stroke={stroke} strokeWidth="0.7" transform={`rotate(${(ci % 2 ? -1 : 1) * i * 4} ${c.cx} ${c.cy})`} />
        ))
      )}
    </svg>
  );
}

/* ------------------------------ Data ------------------------------- */

const CATEGORIES = [
  { id: "invest", title: "Invest & Earn", blurb: "First deposits in partner investing apps", live: 12, top: "Up to \u20B92,400", Ico: Icon.Invest },
  { id: "kyc", title: "KYC & Earn", blurb: "Open demat or bank accounts with partners", live: 8, top: "Up to \u20B9950", Ico: Icon.Kyc },
  { id: "play", title: "Play & Earn", blurb: "Reach milestones in listed mobile games", live: 21, top: "Up to \u20B9600", Ico: Icon.Play },
  { id: "share", title: "Share & Earn", blurb: "Trackable links, ongoing commission per referral", live: 34, top: "Recurring", Ico: Icon.Share },
];

const TRANSACTIONS = [
  { id: "t1", label: "Groww — First deposit", date: "2 Jul, 6:41 PM", amount: 350 },
  { id: "t2", label: "Referral commission — Angel One", date: "1 Jul, 11:02 AM", amount: 120 },
  { id: "t3", label: "Ludo Supreme — Level 12", date: "29 Jun, 9:15 PM", amount: 85 },
  { id: "t4", label: "Upstox — KYC complete", date: "27 Jun, 3:30 PM", amount: 400 },
  { id: "t5", label: "Referral commission — Groww", date: "25 Jun, 8:47 AM", amount: 120 },
];

const NOTIFICATIONS = [
  { id: "n1", title: "New task unlocked", body: "\u201CSpend \u20B93,000 in store\u201D is now available on That's My Seat.", time: "2 hours ago", Ico: Icon.Gift },
  { id: "n2", title: "Money transferred", body: "\u20B9227.10 was sent to your bank account.", time: "1 day ago", Ico: Icon.CreditIn },
  { id: "n3", title: "Transfer failed", body: "Technical error at the bank. Try again or use another payment mode.", time: "1 day ago", Ico: Icon.Shield },
  { id: "n4", title: "Task completed", body: "\u20B9230.00 has been added to your wallet.", time: "3 days ago", Ico: Icon.Check },
];

// Every offer already has its own trackable link. Each event also carries
// a masked referral id so a user can tell *who* converted, not just what.
const SHARE_OFFERS = [
  {
    id: "o1", name: "Upstox", blurb: "Trading & investing", rewardLabel: "\u20B9260 / conversion",
    code: "mgo.link/upstox-a1x9", clicks: 46,
    events: [
      { who: "+91 9\u2022\u2022\u2022\u2022\u2022041", type: "KYC completed", date: "2 Jul, 6:41 PM", amount: 260, status: "Credited" },
      { who: "+91 7\u2022\u2022\u2022\u2022\u2022229", type: "KYC completed", date: "29 Jun, 9:15 AM", amount: 260, status: "Credited" },
      { who: "+91 8\u2022\u2022\u2022\u2022\u2022114", type: "First deposit", date: "27 Jun, 3:30 PM", amount: 260, status: "Credited" },
    ],
  },
  {
    id: "o2", name: "Angel One", blurb: "Investing platform", rewardLabel: "\u20B9240 / conversion",
    code: "mgo.link/angelone-k2p7", clicks: 31,
    events: [{ who: "+91 9\u2022\u2022\u2022\u2022\u2022512", type: "KYC completed", date: "1 Jul, 11:02 AM", amount: 240, status: "Credited" }],
  },
  {
    id: "o3", name: "CoinSwitch", blurb: "Crypto exchange", rewardLabel: "\u20B9280 / conversion",
    code: "mgo.link/coinswitch-q8m4", clicks: 12, events: [],
  },
  {
    id: "o4", name: "Groww", blurb: "Stocks & mutual funds", rewardLabel: "\u20B990 / conversion",
    code: "mgo.link/groww-r5t1", clicks: 58,
    events: [
      { who: "+91 8\u2022\u2022\u2022\u2022\u2022773", type: "First deposit", date: "25 Jun, 8:47 AM", amount: 90, status: "Credited" },
      { who: "+91 9\u2022\u2022\u2022\u2022\u2022056", type: "First deposit", date: "18 Jun, 5:12 PM", amount: 90, status: "Credited" },
      { who: "+91 7\u2022\u2022\u2022\u2022\u2022390", type: "First deposit", date: "9 Jun, 1:40 PM", amount: 90, status: "Credited" },
      { who: "+91 9\u2022\u2022\u2022\u2022\u2022281", type: "First deposit", date: "3 Jun, 10:05 AM", amount: 90, status: "Pending" },
    ],
  },
];

const MENU_SECTIONS = (nav) => [
  {
    heading: "Account",
    items: [
      { label: "Profile", Ico: Icon.User, onClick: () => nav.openScreen("profile") },
      { label: "Wallet", Ico: Icon.Wallet, onClick: () => nav.openTab("wallet") },
      { label: "My activity", Ico: Icon.Grid, onClick: () => nav.openScreen("activity") },
      { label: "Share & earn", Ico: Icon.Gift, onClick: () => nav.openTab("share") },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Feedback", Ico: Icon.Comment, onClick: () => nav.openScreen("feedback") },
      { label: "Contact us", Ico: Icon.Phone, onClick: () => nav.openScreen("contact") },
      { label: "FAQs", Ico: Icon.Comment, onClick: () => nav.openScreen("faqs") },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy policy", Ico: Icon.Lock, onClick: () => nav.openScreen("privacy") },
      { label: "Terms & conditions", Ico: Icon.Doc, onClick: () => nav.openScreen("terms") },
    ],
  },
];

/* --------------------------- Login screen -------------------------- */

function LoginScreen({ onLogin }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  const requestOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    // TODO: POST /auth/otp/request { phone } — server also runs VPN/device checks here.
    setStep("otp");
    setResendIn(60);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const setDigit = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const verify = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError("");
    // TODO: POST /auth/otp/verify { phone, code } → session token.
    onLogin({ phone });
  };

  return (
    <div className="mg-login">
      <div className="mg-login-art">
        <Guilloche tone="light" />
        <div className="mg-serif mg-login-mark">
          Money<b>Go</b>
        </div>
        <p className="mg-login-tag">Trusted. Tracked. Rewarded.</p>
      </div>

      <div className="mg-login-panel">
        {step === "phone" ? (
          <>
            <h1 className="mg-serif mg-login-h">Sign in</h1>
            <p className="mg-login-sub">One account per mobile number. We verify with an OTP — no passwords.</p>

            <label className="mg-field-label" htmlFor="mg-phone">Mobile number</label>
            <div className="mg-phone-row">
              <span className="mg-cc">+91</span>
              <input
                id="mg-phone"
                className="mg-input"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && requestOtp()}
              />
            </div>

            {error && <p className="mg-error" role="alert">{error}</p>}

            <button className="mg-btn" onClick={requestOtp}>
              Send OTP <Icon.Arrow />
            </button>

            <p className="mg-login-legal">
              By continuing you agree to the Terms &amp; Conditions and Privacy Policy.
            </p>
          </>
        ) : (
          <>
            <button className="mg-back" onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setError(""); }}>
              <Icon.Back /> Change number
            </button>
            <h1 className="mg-serif mg-login-h">Verify OTP</h1>
            <p className="mg-login-sub">
              Code sent to <span className="mg-mono">+91 {phone}</span>
            </p>

            <div className="mg-otp-row">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="mg-otp"
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onOtpKey(i, e)}
                />
              ))}
            </div>

            {error && <p className="mg-error" role="alert">{error}</p>}

            <button className="mg-btn" onClick={verify}>
              Verify and continue <Icon.Arrow />
            </button>

            <button className="mg-resend" disabled={resendIn > 0} onClick={() => setResendIn(60)}>
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </>
        )}

        <div className="mg-login-secure">
          <Icon.Shield /> Sessions on VPN or proxy connections cannot sign in.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Top bar ----------------------------- */

function TopBar({ title, onMenu, onBell }) {
  return (
    <header className="mg-header">
      <button className="mg-icon-btn" aria-label="Open menu" onClick={onMenu}>
        <Icon.Menu />
      </button>
      <div className="mg-serif mg-header-title">{title}</div>
      <div className="mg-header-right">
        <button className="mg-icon-btn" aria-label="Notifications" onClick={onBell}>
          <Icon.Bell />
        </button>
      </div>
    </header>
  );
}

/* ------------------------------ Drawer ------------------------------ */

function MenuDrawer({ open, onClose, onLogout, nav, name, phone, photo }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sections = MENU_SECTIONS(nav);

  return (
    <div className={`mg-drawer-layer ${open ? "on" : ""}`} aria-hidden={!open}>
      <div className="mg-drawer-backdrop" onClick={onClose} />
      <aside className="mg-drawer" role="dialog" aria-modal="true" aria-label="Account menu">
        <div className="mg-drawer-top">
          <button className="mg-drawer-id" onClick={() => nav.openScreen("profile")}>
            <span className="mg-drawer-avatar" style={photo ? { backgroundImage: `url(${photo})` } : undefined}>
              {!photo && <Icon.User width={20} height={20} />}
            </span>
            <span>
              <span className="mg-drawer-name">{name}</span>
              <span className="mg-drawer-phone mg-mono">+91 {formatPhone(phone)}</span>
            </span>
          </button>
          <button className="mg-icon-btn mg-drawer-close" aria-label="Close menu" onClick={onClose}>
            <Icon.Close />
          </button>
        </div>

        <nav className="mg-drawer-body">
          {sections.map((section) => (
            <div key={section.heading} className="mg-drawer-section">
              <div className="mg-drawer-heading">{section.heading}</div>
              {section.items.map(({ label, Ico, onClick }) => (
                <button key={label} className="mg-drawer-item" onClick={onClick}>
                  <span className="mg-drawer-item-icon"><Ico /></span>
                  {label}
                  <Icon.Chevron className="mg-drawer-item-chevron" />
                </button>
              ))}
            </div>
          ))}
        </nav>

        <button className="mg-drawer-logout" onClick={onLogout}>
          <Icon.LogOut /> Log out
        </button>
      </aside>
    </div>
  );
}

/* ---------------------------- Home tab ----------------------------- */

function HomeTab({ onMenu, onBell }) {
  return (
    <>
      <TopBar title={<span className="mg-wordmark">Money<b>Go</b></span>} onMenu={onMenu} onBell={onBell} />

      <div className="mg-trust">
        <Icon.Shield />
        Every conversion is tracked and credited automatically.
      </div>

      <h2 className="mg-serif mg-h2">Ways to earn</h2>
      <p className="mg-sub">Four categories. Live offers refresh daily.</p>

      <div className="mg-grid">
        {CATEGORIES.map(({ id, title, blurb, live, top, Ico }) => (
          <button key={id} className="mg-card" onClick={() => console.log("navigate:", `/offers/${id}`)}>
            <span className="mg-card-icon"><Ico /></span>
            <span className="mg-card-body">
              <span className="mg-card-title">{title}</span>
              <span className="mg-card-blurb">{blurb}</span>
              <span className="mg-card-meta">
                <span className="mg-live"><span className="mg-dot" /> {live} live</span>
                <span className="mg-top">{top}</span>
              </span>
            </span>
            <span className="mg-card-arrow"><Icon.Arrow /></span>
          </button>
        ))}
      </div>
    </>
  );
}

/* --------------------------- Wallet tab ---------------------------- */

function WalletTab({ balance, onMenu, onBell }) {
  const animated = useCountUp(balance);
  return (
    <>
      <TopBar title="Wallet" onMenu={onMenu} onBell={onBell} />

      <section className="mg-wallet" aria-label="Wallet balance">
        <Guilloche tone="light" />
        <div style={{ position: "relative" }}>
          <div className="mg-wallet-label">
            <Icon.Wallet width={16} height={16} /> Available balance
          </div>
          <div className="mg-serif mg-balance">
            <span className="mg-rupee">{"\u20B9"}</span>
            <span className="mg-mono">{inr(animated)}</span>
          </div>
          <div className="mg-wallet-foot">
            <span>This month <span className="mg-mono" style={{ color: "#F4F6F2" }}>+ {"\u20B9"}3,180.00</span></span>
          </div>
        </div>
      </section>

      <h2 className="mg-serif mg-h2" style={{ fontSize: 19, marginTop: 26 }}>Earning history</h2>
      <p className="mg-sub">Credits appear automatically once a partner confirms your conversion.</p>

      <div className="mg-txn-list">
        {TRANSACTIONS.map((t) => (
          <div key={t.id} className="mg-txn">
            <span className="mg-txn-icon"><Icon.CreditIn /></span>
            <span className="mg-txn-body">
              <span className="mg-txn-label">{t.label}</span>
              <span className="mg-txn-date">{t.date}</span>
            </span>
            <span className="mg-mono mg-txn-amt">+ {"\u20B9"}{inr(t.amount)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------- Share & Earn tab ------------------------- */

function OfferActivity({ offer, onBack, copiedId, onCopy }) {
  const earned = offer.events.reduce((s, e) => s + (e.status === "Credited" ? e.amount : 0), 0);
  return (
    <>
      <div className="mg-offer-activity-head">
        <button className="mg-icon-btn" aria-label="Back" onClick={onBack}><Icon.Back /></button>
        <div>
          <div className="mg-card-title" style={{ fontSize: 16 }}>{offer.name}</div>
          <div className="mg-card-blurb">{offer.blurb}</div>
        </div>
      </div>

      <div className="mg-stat-row" style={{ marginTop: 18 }}>
        <div className="mg-stat">
          <span className="mg-stat-label">Earned</span>
          <span className="mg-serif mg-stat-value">{"\u20B9"}{inr(earned)}</span>
        </div>
        <div className="mg-stat">
          <span className="mg-stat-label">Clicks</span>
          <span className="mg-serif mg-stat-value">{offer.clicks}</span>
        </div>
        <div className="mg-stat">
          <span className="mg-stat-label">Conversions</span>
          <span className="mg-serif mg-stat-value">{offer.events.length}</span>
        </div>
      </div>

      <div className="mg-link-code-row" style={{ marginTop: 16 }}>
        <span className="mg-mono mg-link-code">{offer.code}</span>
        <button className="mg-copy-btn" onClick={() => onCopy(offer.id, offer.code)}>
          {copiedId === offer.id ? <Icon.Check width={12} height={12} /> : <Icon.Copy width={12} height={12} />}
          {copiedId === offer.id ? "Copied" : "Copy"}
        </button>
      </div>

      <h2 className="mg-serif mg-h2" style={{ fontSize: 18, marginTop: 24 }}>Who did what, when</h2>
      <p className="mg-sub">Every click that converted through your link for this offer.</p>

      {offer.events.length === 0 ? (
        <div className="mg-event-empty" style={{ borderTop: "none", marginTop: 0 }}>No clicks have converted yet — keep sharing.</div>
      ) : (
        <div className="mg-who-list">
          {offer.events.map((e, i) => (
            <div key={i} className="mg-who-card">
              <span className="mg-txn-icon"><Icon.CreditIn /></span>
              <span className="mg-txn-body">
                <span className="mg-txn-label mg-mono">{e.who}</span>
                <span className="mg-txn-date">{e.type} · {e.date}</span>
              </span>
              <span style={{ textAlign: "right" }}>
                <span className={`mg-event-status ${e.status === "Pending" ? "pending" : ""}`} style={{ display: "block" }}>{e.status}</span>
                <span className="mg-mono mg-txn-amt">{"\u20B9"}{inr(e.amount)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ShareEarnTab({ onMenu, onBell }) {
  const [view, setView] = useState("offers"); // offers | links
  const [copiedId, setCopiedId] = useState(null);
  const [openOfferId, setOpenOfferId] = useState(null);

  const copy = (id, code) => {
    if (navigator?.clipboard) navigator.clipboard.writeText(`https://${code}`).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1600);
  };

  const totalEarnings = SHARE_OFFERS.reduce((s, o) => s + o.events.reduce((es, e) => es + (e.status === "Credited" ? e.amount : 0), 0), 0);
  const totalClicks = SHARE_OFFERS.reduce((s, o) => s + o.clicks, 0);
  const totalConversions = SHARE_OFFERS.reduce((s, o) => s + o.events.length, 0);

  const openOffer = openOfferId ? SHARE_OFFERS.find((o) => o.id === openOfferId) : null;

  return (
    <>
      <TopBar title="Share & Earn" onMenu={onMenu} onBell={onBell} />

      {openOffer ? (
        <OfferActivity offer={openOffer} onBack={() => setOpenOfferId(null)} copiedId={copiedId} onCopy={copy} />
      ) : (
        <>
          <div className="mg-seg" role="tablist" aria-label="Share and earn view">
            <button role="tab" aria-selected={view === "offers"} className={`mg-seg-btn ${view === "offers" ? "on" : ""}`} onClick={() => setView("offers")}>
              Offers to share
            </button>
            <button role="tab" aria-selected={view === "links"} className={`mg-seg-btn ${view === "links" ? "on" : ""}`} onClick={() => setView("links")}>
              My links
            </button>
          </div>

          {view === "offers" ? (
            <>
              <p className="mg-sub" style={{ marginTop: 18 }}>
                Every offer already has a link that's unique to your account. Tap an offer's name
                to see exactly who converted through it and when.
              </p>
              <div className="mg-share-offer-list">
                {SHARE_OFFERS.map((o) => (
                  <div key={o.id} className="mg-share-offer">
                    <div className="mg-share-offer-top">
                      <span className="mg-card-icon" style={{ width: 40, height: 40, flexShrink: 0 }}>
                        <Icon.Gift width={19} height={19} />
                      </span>
                      <span className="mg-share-offer-text">
                        <button className="mg-offer-name-btn" onClick={() => setOpenOfferId(o.id)}>
                          {o.name} <Icon.Chevron width={12} height={12} />
                        </button>
                        <span className="mg-card-blurb">{o.blurb}</span>
                      </span>
                      <span className="mg-share-reward">{o.rewardLabel}</span>
                    </div>
                    <div className="mg-link-code-row" style={{ marginTop: 12 }}>
                      <span className="mg-mono mg-link-code">{o.code}</span>
                      <button className="mg-copy-btn" onClick={() => copy(o.id, o.code)}>
                        {copiedId === o.id ? <Icon.Check width={12} height={12} /> : <Icon.Copy width={12} height={12} />}
                        {copiedId === o.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mg-stat-row">
                <div className="mg-stat">
                  <span className="mg-stat-label">Total earnings</span>
                  <span className="mg-serif mg-stat-value">{"\u20B9"}{inr(totalEarnings)}</span>
                </div>
                <div className="mg-stat">
                  <span className="mg-stat-label">Clicks</span>
                  <span className="mg-serif mg-stat-value">{totalClicks}</span>
                </div>
                <div className="mg-stat">
                  <span className="mg-stat-label">Conversions</span>
                  <span className="mg-serif mg-stat-value">{totalConversions}</span>
                </div>
              </div>

              <h2 className="mg-serif mg-h2" style={{ fontSize: 19, marginTop: 26 }}>Link performance</h2>
              <p className="mg-sub">Every tracked action, so you can see exactly what earned what.</p>

              <div className="mg-link-list">
                {SHARE_OFFERS.map((o) => {
                  const earned = o.events.reduce((s, e) => s + (e.status === "Credited" ? e.amount : 0), 0);
                  return (
                    <div key={o.id} className="mg-link-card">
                      <div className="mg-link-top">
                        <button className="mg-offer-name-btn" onClick={() => setOpenOfferId(o.id)}>
                          {o.name} <Icon.Chevron width={12} height={12} />
                        </button>
                        <span className="mg-mono mg-txn-amt">+ {"\u20B9"}{inr(earned)}</span>
                      </div>
                      <div className="mg-link-code-row">
                        <span className="mg-mono mg-link-code">{o.code}</span>
                        <button className="mg-copy-btn" onClick={() => copy(`d-${o.id}`, o.code)}>
                          {copiedId === `d-${o.id}` ? <Icon.Check width={12} height={12} /> : <Icon.Copy width={12} height={12} />}
                          {copiedId === `d-${o.id}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="mg-link-stats">
                        {o.clicks} clicks<span className="mg-link-sep">·</span>{o.events.length} conversions
                      </div>

                      {o.events.length > 0 ? (
                        <div className="mg-event-list">
                          {o.events.map((e, i) => (
                            <div key={i} className="mg-event-row">
                              <span className="mg-event-who mg-mono">{e.who}</span>
                              <span className="mg-event-type">{e.type}</span>
                              <span className={`mg-event-status ${e.status === "Pending" ? "pending" : ""}`}>{e.status}</span>
                              <span className="mg-mono mg-event-amt">{"\u20B9"}{inr(e.amount)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mg-event-empty">No clicks have converted yet — keep sharing.</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

/* ------------------------------ Screens ----------------------------- */

function ScreenShell({ title, onBack, children }) {
  return (
    <div className="mg-shell">
      <header className="mg-header">
        <button className="mg-icon-btn" aria-label="Back" onClick={onBack}>
          <Icon.Back />
        </button>
        <div className="mg-serif mg-header-title">{title}</div>
        <div />
      </header>
      {children}
    </div>
  );
}

function computeStrength({ name, phoneVerified, emailVerified, dobSet, gender, photo }) {
  const checks = [Boolean(name.trim()), phoneVerified, emailVerified, dobSet, Boolean(gender), Boolean(photo)];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function ProfileScreen({
  onBack, name, setName, phone, photo, onPhotoChange,
  email, setEmail, emailStatus, setEmailStatus, emailResendIn, setEmailResendIn,
  dob, setDob, dobLocked, setDobLocked, gender, setGender,
}) {
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  // Real flow: the confirmation email links back here with a token, e.g.
  // https://app.moneygo.in/profile?emailVerifyToken=XYZ — we read it on load.
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("emailVerifyToken");
    if (token) {
      // TODO: POST /me/email/confirm { token }
      setEmailStatus("verified");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (emailResendIn <= 0) return;
    const id = setTimeout(() => setEmailResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [emailResendIn]);

  const sendVerification = () => {
    if (!isValidEmail(email) || emailResendIn > 0) return;
    // TODO: POST /me/email/verify-request { email } — backend emails a
    // confirmation link containing a token back to this screen's URL.
    setEmailStatus("pending");
    setEmailResendIn(60);
  };

  const pickPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onPhotoChange(URL.createObjectURL(f));
  };

  const save = () => {
    // TODO: PATCH /me { name, email, dob, gender }
    if (dob) setDobLocked(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const strength = computeStrength({
    name, phoneVerified: true, emailVerified: emailStatus === "verified",
    dobSet: dobLocked, gender, photo,
  });

  return (
    <ScreenShell title="Profile" onBack={onBack}>
      <div className="mg-avatar-block">
        <div className="mg-avatar-circle" style={photo ? { backgroundImage: `url(${photo})` } : undefined}>
          {!photo && <Icon.User width={30} height={30} />}
        </div>
        <button className="mg-avatar-pencil" aria-label="Change photo" onClick={() => fileRef.current?.click()}>
          <Icon.Pencil width={13} height={13} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
      </div>

      <div className="mg-profile-strength">
        <span>Profile strength</span>
        <span className="mg-profile-strength-pill">{strength}% complete</span>
      </div>

      <label className="mg-field-label">Full name</label>
      <input className="mg-input" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="mg-field-label" style={{ marginTop: 16 }}>Mobile number</label>
      <div className="mg-locked-field">
        <span className="mg-mono">+91 {formatPhone(phone)}</span>
        <span className="mg-verified">Verified</span>
      </div>
      <p className="mg-field-hint">Verified when you signed in with OTP — it can't be changed here.</p>

      <label className="mg-field-label" style={{ marginTop: 16 }}>Email</label>
      {emailStatus === "verified" ? (
        <>
          <div className="mg-locked-field">
            <span>{email}</span>
            <span className="mg-verified">Verified</span>
          </div>
          <p className="mg-field-hint">Verified — it can't be changed here.</p>
        </>
      ) : emailStatus === "pending" ? (
        <div className="mg-email-pending">
          <Icon.Mail width={18} height={18} />
          <div>
            <div className="mg-card-title" style={{ fontSize: 13.5 }}>Check your inbox</div>
            <div className="mg-field-hint" style={{ margin: "3px 0 8px" }}>
              We sent a confirmation link to <strong>{email}</strong>. Click it to verify.
            </div>
            <button className="mg-resend" style={{ margin: 0 }} disabled={emailResendIn > 0} onClick={sendVerification}>
              {emailResendIn > 0 ? `Resend link in ${emailResendIn}s` : "Resend link"}
            </button>
            {/* DEV PREVIEW ONLY — remove once the real email + redirect flow is wired to a backend. */}
            <button
              className="mg-resend"
              style={{ margin: "6px 0 0", color: T.inkSoft }}
              onClick={() => setEmailStatus("verified")}
            >
              Simulate confirmation click (preview only)
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mg-email-row">
            <input
              className="mg-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="mg-mini-btn" disabled={!isValidEmail(email)} onClick={sendVerification}>
              Verify
            </button>
          </div>
          <p className="mg-field-hint">We'll email a confirmation link — click it to verify.</p>
        </>
      )}

      <label className="mg-field-label" style={{ marginTop: 16 }}>Date of birth</label>
      {dobLocked ? (
        <>
          <div className="mg-locked-field">
            <span>{new Date(dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="mg-verified">Saved</span>
          </div>
          <p className="mg-field-hint">Set once and locked — contact support to change it.</p>
        </>
      ) : (
        <input className="mg-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      )}

      <label className="mg-field-label" style={{ marginTop: 16 }}>Gender</label>
      <div className="mg-gender-row">
        {["male", "female"].map((g) => (
          <button key={g} className={`mg-gender-pill ${gender === g ? "on" : ""}`} onClick={() => setGender(g)}>
            {g === "male" ? "Male" : "Female"}
          </button>
        ))}
      </div>

      <button className="mg-btn" style={{ marginTop: 24 }} onClick={save}>
        {saved ? "Saved" : "Save changes"} {saved ? <Icon.Check /> : <Icon.Arrow />}
      </button>
    </ScreenShell>
  );
}

const ACTIVITY_ROWS = [
  { category: "Invest & Earn", inProgress: 2, completed: 5, expired: 1 },
  { category: "KYC & Earn", inProgress: 1, completed: 3, expired: 0 },
  { category: "Play & Earn", inProgress: 4, completed: 6, expired: 2 },
  { category: "Share & Earn", inProgress: 3, completed: 8, expired: 0 },
];

function ActivityScreen({ onBack }) {
  return (
    <ScreenShell title="My activity" onBack={onBack}>
      <p className="mg-sub" style={{ marginTop: 4 }}>
        Where every offer you've touched currently stands.
      </p>
      <div className="mg-activity-list">
        {ACTIVITY_ROWS.map((r) => (
          <div key={r.category} className="mg-activity-card">
            <div className="mg-card-title" style={{ fontSize: 14.5, marginBottom: 10 }}>{r.category}</div>
            <div className="mg-activity-stats">
              <div><span className="mg-mono mg-activity-num" style={{ color: T.gold }}>{r.inProgress}</span><span>In progress</span></div>
              <div><span className="mg-mono mg-activity-num" style={{ color: T.green }}>{r.completed}</span><span>Completed</span></div>
              <div><span className="mg-mono mg-activity-num" style={{ color: T.red }}>{r.expired}</span><span>Expired</span></div>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function NotificationsScreen({ onBack }) {
  return (
    <ScreenShell title="Notifications" onBack={onBack}>
      <div className="mg-notif-list">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="mg-notif-card">
            <span className="mg-txn-icon"><n.Ico /></span>
            <span className="mg-txn-body">
              <span className="mg-txn-label">{n.title}</span>
              <span className="mg-notif-body">{n.body}</span>
              <span className="mg-txn-date">{n.time}</span>
            </span>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function FeedbackContactScreen({ onBack, mode, emailVerified, onLinkEmail }) {
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [ticket, setTicket] = useState(null);

  const submit = () => {
    if (!category || !details.trim()) return;
    // TODO: POST /support/{feedback|contact}
    if (mode === "contact") setTicket(`MG-${Math.floor(100000 + Math.random() * 900000)}`);
    else setTicket("sent");
  };

  const title = mode === "contact" ? "Contact us" : "Feedback";

  if (!emailVerified) {
    return (
      <ScreenShell title={title} onBack={onBack}>
        <div className="mg-email-gate">
          <span className="mg-email-gate-icon"><Icon.Mail width={22} height={22} /></span>
          <p className="mg-card-title" style={{ fontSize: 15.5 }}>Link your email to continue</p>
          <p className="mg-sub" style={{ textAlign: "center" }}>
            {mode === "contact"
              ? "We reply to support tickets by email, so verify one before raising a ticket."
              : "Verifying an email lets us follow up on your feedback if needed."}
          </p>
          <button className="mg-btn" style={{ width: "auto", padding: "13px 22px" }} onClick={onLinkEmail}>
            Link email <Icon.Arrow />
          </button>
        </div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={title} onBack={onBack}>
      {ticket ? (
        <div className="mg-ticket-confirm">
          <Icon.Check width={22} height={22} style={{ color: T.green }} />
          {mode === "contact" ? (
            <>
              <p className="mg-card-title">Ticket {ticket}</p>
              <p className="mg-sub">We'll reply on your registered email. Keep this ID for reference.</p>
            </>
          ) : (
            <p className="mg-card-title">Thanks for the feedback.</p>
          )}
        </div>
      ) : (
        <>
          <label className="mg-field-label">Category</label>
          <select className="mg-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option>Wallet & payments</option>
            <option>Offers & tracking</option>
            <option>Account & login</option>
            <option>Other</option>
          </select>

          <label className="mg-field-label" style={{ marginTop: 16 }}>Details</label>
          <textarea
            className="mg-input mg-textarea"
            maxLength={250}
            placeholder={mode === "contact" ? "Let us know your issue here." : "Enter your details"}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className="mg-char-count">{details.length}/250 words</div>

          <button className="mg-btn" onClick={submit} disabled={!category || !details.trim()}>
            Submit <Icon.Arrow />
          </button>
        </>
      )}
    </ScreenShell>
  );
}

const FAQ_DATA = {
  Transfer: [
    ["Why is my wallet locked?", "Wallets are temporarily locked if unusual activity is detected on your account. Contact support to review it."],
    ["How to add my bank/UPI details?", "Go to Wallet → Withdraw → Add payment method, then enter your bank or UPI details."],
    ["How to withdraw my earnings?", "Open Wallet, tap Withdraw, choose a payment method and confirm the amount."],
    ["How long does a transfer take?", "Most transfers complete within 24–48 hours once approved."],
  ],
  "Share & Earn": [
    ["How is a conversion tracked?", "Each offer's link is unique to your account, so any click or conversion through it is attributed to you automatically."],
    ["Why does a conversion show Pending?", "The partner network confirms conversions in batches — it moves to Credited once they verify it."],
  ],
};

function FaqScreen({ onBack }) {
  const [openKey, setOpenKey] = useState(null);
  return (
    <ScreenShell title="FAQs" onBack={onBack}>
      {Object.entries(FAQ_DATA).map(([section, items]) => (
        <div key={section} style={{ marginBottom: 20 }}>
          <div className="mg-drawer-heading" style={{ padding: "0 0 8px" }}>{section}</div>
          <div className="mg-faq-list">
            {items.map(([q, a], i) => {
              const key = `${section}-${i}`;
              const open = openKey === key;
              return (
                <div key={key} className="mg-faq-item">
                  <button className="mg-faq-q" onClick={() => setOpenKey(open ? null : key)}>
                    {q}
                    <Icon.Chevron style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s ease" }} />
                  </button>
                  {open && <p className="mg-faq-a">{a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </ScreenShell>
  );
}

function LegalScreen({ onBack, title }) {
  return (
    <ScreenShell title={title} onBack={onBack}>
      <p className="mg-sub" style={{ marginTop: 4 }}>
        This section will hold the live {title.toLowerCase()} text, managed from the admin panel's
        content editor so it can change without a new release.
      </p>
    </ScreenShell>
  );
}

/* ------------------------------ Shell ------------------------------ */

const TABS = [
  { id: "home", label: "Home", Ico: Icon.Home },
  { id: "share", label: "Share & Earn", Ico: Icon.Share },
  { id: "wallet", label: "Wallet", Ico: Icon.Wallet },
];

export default function MoneyGoApp() {
  const [phase, setPhase] = useState("splash"); // splash | login | app
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("Suraj Tiwari");
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("unset"); // unset | pending | verified
  const [emailResendIn, setEmailResendIn] = useState(0);
  const [dob, setDob] = useState("");
  const [dobLocked, setDobLocked] = useState(false);
  const [gender, setGender] = useState("");
  const balance = 18240.5;

  useEffect(() => {
    if (phase !== "splash") return;
    const id = setTimeout(() => setPhase("login"), 2000);
    return () => clearTimeout(id);
  }, [phase]);

  const nav = {
    openTab: (id) => { setTab(id); setScreen(null); setMenuOpen(false); },
    openScreen: (id) => { setScreen(id); setMenuOpen(false); },
  };

  const logout = () => {
    setMenuOpen(false);
    setScreen(null);
    setTab("home");
    setPhase("login");
  };

  return (
    <div className="mg-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Albert+Sans:wght@400;500;600;700&family=Spline+Sans+Mono:wght@500;600&display=swap');

        .mg-root {
          --ivory: ${T.ivory}; --paper: ${T.paper}; --ink: ${T.ink};
          --ink-soft: ${T.inkSoft}; --line: ${T.line};
          --green: ${T.green}; --green-deep: ${T.greenDeep};
          --gold: ${T.gold}; --red: ${T.red};
          min-height: 100vh; background: var(--ivory); color: var(--ink);
          font-family: 'Albert Sans', sans-serif; -webkit-font-smoothing: antialiased;
        }
        .mg-serif { font-family: 'Libre Caslon Text', serif; }
        .mg-mono { font-family: 'Spline Sans Mono', monospace; font-variant-numeric: tabular-nums; }

        /* ---------- Splash ---------- */
        .mg-splash {
          min-height: 100vh; display: grid; place-items: center;
          background: linear-gradient(148deg, var(--green) 0%, var(--green-deep) 100%);
          color: #F4F6F2; position: relative; overflow: hidden;
        }
        .mg-splash-mark { font-size: 40px; animation: mgSplash .8s ease both; }
        .mg-splash-mark b { color: #D8C48B; font-weight: 700; }
        .mg-splash-tag {
          position: relative; margin: 10px 0 0; color: #C9D6CC; font-size: 13px;
          letter-spacing: .08em; text-transform: uppercase;
          animation: mgSplash .8s ease .25s both;
        }
        @keyframes mgSplash { from { opacity: 0; transform: translateY(14px); } }

        /* ---------- Login ---------- */
        .mg-login { min-height: 100vh; display: flex; flex-direction: column; }
        .mg-login-art {
          position: relative; overflow: hidden;
          background: linear-gradient(148deg, var(--green) 0%, var(--green-deep) 100%);
          color: #F4F6F2; padding: 64px 28px 44px;
        }
        .mg-login-mark { position: relative; font-size: 32px; }
        .mg-login-mark b { color: #D8C48B; font-weight: 700; }
        .mg-login-tag { position: relative; margin: 8px 0 0; color: #C9D6CC; font-size: 13.5px; letter-spacing: .04em; }
        .mg-login-panel {
          flex: 1; background: var(--ivory); margin-top: -18px;
          border-radius: 22px 22px 0 0; padding: 30px 24px 40px;
          max-width: 480px; width: 100%; margin-left: auto; margin-right: auto;
        }
        @media (min-width: 900px) {
          .mg-login { flex-direction: row; }
          .mg-login-art { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px; }
          .mg-login-panel { flex: 1; margin-top: 0; border-radius: 0; display: flex; flex-direction: column; justify-content: center; padding: 60px; max-width: none; }
        }
        .mg-login-h { font-size: 27px; font-weight: 400; margin: 0 0 8px; }
        .mg-login-sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 26px; }
        .mg-field-label { display: block; font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 8px; }
        .mg-field-hint { font-size: 11.5px; color: var(--ink-soft); margin: 6px 2px 0; }
        .mg-phone-row { display: flex; gap: 10px; }
        .mg-cc {
          display: grid; place-items: center; padding: 0 14px;
          border: 1px solid var(--line); border-radius: 12px; background: #fff;
          font-weight: 600; color: var(--ink-soft);
        }
        .mg-input {
          width: 100%; box-sizing: border-box; border: 1px solid var(--line); border-radius: 12px;
          background: #fff; padding: 14px 16px; font: inherit; font-size: 15px;
          outline: none; transition: border-color .2s ease; color: var(--ink);
        }
        .mg-phone-row .mg-input { flex: 1; min-width: 0; letter-spacing: .04em; font-size: 16px; }
        .mg-input:focus { border-color: var(--green); }
        .mg-textarea { min-height: 110px; resize: vertical; font-family: inherit; }
        .mg-char-count { text-align: right; font-size: 11.5px; color: var(--ink-soft); margin-top: 6px; }
        .mg-otp-row { display: flex; gap: 9px; }
        .mg-otp {
          width: 100%; aspect-ratio: .84; text-align: center;
          border: 1px solid var(--line); border-radius: 12px; background: #fff;
          font-family: 'Spline Sans Mono', monospace; font-size: 20px;
          outline: none; transition: border-color .2s ease;
        }
        .mg-otp:focus { border-color: var(--green); }
        .mg-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; margin-top: 22px; padding: 15px 18px;
          background: var(--green); color: #F4F6F2; border: 0; border-radius: 12px;
          font: inherit; font-weight: 600; font-size: 15px; cursor: pointer;
          transition: background .2s ease, transform .15s ease;
        }
        .mg-btn:hover { background: var(--green-deep); }
        .mg-btn:active { transform: scale(.99); }
        .mg-btn:disabled { background: var(--line); color: var(--ink-soft); cursor: not-allowed; }
        .mg-btn svg { width: 16px; height: 16px; }
        .mg-btn:focus-visible, .mg-card:focus-visible, .mg-tab:focus-visible,
        .mg-drawer-item:focus-visible, .mg-icon-btn:focus-visible {
          outline: 2px solid var(--green); outline-offset: 2px;
        }
        .mg-error { color: var(--red); font-size: 13px; margin: 10px 0 0; }
        .mg-back {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 18px;
          background: none; border: 0; padding: 0; font: inherit; font-size: 13.5px;
          color: var(--ink-soft); cursor: pointer;
        }
        .mg-back svg { width: 15px; height: 15px; }
        .mg-resend {
          display: block; margin: 16px auto 0; background: none; border: 0;
          font: inherit; font-size: 13.5px; font-weight: 600; color: var(--green); cursor: pointer;
        }
        .mg-resend:disabled { color: var(--ink-soft); font-weight: 400; cursor: default; }
        .mg-login-legal { color: var(--ink-soft); font-size: 12px; margin-top: 18px; }
        .mg-login-secure {
          display: flex; align-items: center; gap: 8px; margin-top: 34px;
          color: var(--ink-soft); font-size: 12.5px;
        }
        .mg-login-secure svg { width: 15px; height: 15px; color: var(--green); flex-shrink: 0; }

        /* ---------- App shell ---------- */
        .mg-shell {
          max-width: 480px; margin: 0 auto;
          padding: 0 20px calc(86px + env(safe-area-inset-bottom));
        }
        @media (min-width: 900px) { .mg-shell { max-width: 560px; } }

        /* ---------- Top bar ---------- */
        .mg-header {
          display: grid; grid-template-columns: 40px 1fr 40px; align-items: center;
          padding: 18px 0 16px; gap: 10px;
        }
        .mg-header-title { font-size: 19px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mg-header-right { display: flex; align-items: center; justify-content: flex-end; }
        .mg-wordmark b { color: var(--green); font-weight: 700; }

        /* Icon buttons: tactile press feedback everywhere they're used. */
        .mg-icon-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid var(--line); background: #fff; color: var(--ink);
          display: grid; place-items: center; cursor: pointer;
          transition: border-color .2s ease, color .2s ease; flex-shrink: 0;
        }
        .mg-icon-btn svg { width: 18px; height: 18px; transition: transform .18s ease; }
        .mg-icon-btn:hover { border-color: var(--green); color: var(--green); }
        .mg-icon-btn:active svg { transform: scale(.8) rotate(-10deg); }
        /* The drawer's close button gets its own distinct flourish — rotates into place. */
        .mg-drawer-close:hover svg { transform: rotate(90deg); }
        .mg-drawer-close:active svg { transform: rotate(90deg) scale(.8); }

        .mg-trust { display: flex; align-items: center; gap: 8px; margin: 4px 2px 24px; color: var(--ink-soft); font-size: 12.5px; }
        .mg-trust svg { width: 15px; height: 15px; color: var(--green); flex-shrink: 0; }

        .mg-h2 { font-size: 24px; font-weight: 400; margin: 0; }
        .mg-sub { color: var(--ink-soft); font-size: 13.5px; margin: 6px 0 18px; }

        .mg-grid { display: grid; gap: 12px; }
        @media (min-width: 720px) { .mg-grid { grid-template-columns: 1fr 1fr; } }
        .mg-card {
          display: flex; align-items: center; gap: 16px; width: 100%; text-align: left;
          background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px;
          cursor: pointer; font: inherit; color: inherit;
          transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
          opacity: 0; transform: translateY(12px); animation: mgUp .5s ease forwards;
        }
        .mg-card:nth-child(1) { animation-delay: .06s; }
        .mg-card:nth-child(2) { animation-delay: .12s; }
        .mg-card:nth-child(3) { animation-delay: .18s; }
        .mg-card:nth-child(4) { animation-delay: .24s; }
        @keyframes mgUp { to { opacity: 1; transform: none; } }
        .mg-card:hover { border-color: var(--green); transform: translateY(-2px); box-shadow: 0 14px 30px -22px rgba(15,77,58,.45); }
        .mg-card-icon { width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0; background: var(--paper); color: var(--green); display: grid; place-items: center; }
        .mg-card-icon svg { width: 23px; height: 23px; }
        .mg-card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .mg-card-title { font-size: 16px; font-weight: 600; }
        .mg-card-blurb { display: block; font-size: 12.5px; color: var(--ink-soft); margin-top: 3px; }
        .mg-card-meta { display: flex; gap: 12px; margin-top: 9px; font-size: 12px; }
        .mg-live { display: inline-flex; align-items: center; gap: 5px; color: var(--green); font-weight: 600; }
        .mg-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
        .mg-top { color: var(--gold); font-weight: 600; }
        .mg-card-arrow { color: var(--ink-soft); transition: color .2s ease, transform .2s ease; flex-shrink: 0; }
        .mg-card-arrow svg { width: 18px; height: 18px; }
        .mg-card:hover .mg-card-arrow { color: var(--green); transform: translateX(3px); }

        /* ---------- Wallet hero (Wallet tab only) ---------- */
        .mg-wallet {
          position: relative; overflow: hidden; border-radius: 18px;
          background: linear-gradient(148deg, var(--green) 0%, var(--green-deep) 100%);
          color: #F4F6F2; padding: 24px 22px 20px;
          box-shadow: 0 18px 40px -22px rgba(10,54,40,.55);
        }
        .mg-wallet-label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #C9D6CC; }
        .mg-balance { font-size: 34px; margin-top: 10px; }
        .mg-balance .mg-rupee { font-size: 22px; margin-right: 4px; color: #C9D6CC; }
        .mg-wallet-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(244,246,242,.16); font-size: 13px; color: #C9D6CC; }

        .mg-txn-list { display: grid; gap: 10px; }
        .mg-txn {
          display: flex; align-items: center; gap: 14px;
          background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px;
        }
        .mg-txn-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--paper); color: var(--green); display: grid; place-items: center; flex-shrink: 0; }
        .mg-txn-icon svg { width: 18px; height: 18px; }
        .mg-txn-body { flex: 1; min-width: 0; }
        .mg-txn-label { display: block; font-size: 14px; font-weight: 500; }
        .mg-txn-date { display: block; font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
        .mg-txn-amt { font-size: 14px; color: var(--green); font-weight: 600; white-space: nowrap; }

        /* ---------- Notifications ---------- */
        .mg-notif-list { display: grid; gap: 10px; }
        .mg-notif-card {
          display: flex; align-items: flex-start; gap: 14px;
          background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px;
        }
        .mg-notif-body { display: block; font-size: 12.5px; color: var(--ink-soft); margin: 3px 0; line-height: 1.4; }

        /* ---------- Share & Earn ---------- */
        .mg-seg {
          display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
          background: var(--paper); border-radius: 12px; padding: 4px; margin-top: 4px;
        }
        .mg-seg-btn {
          border: 0; background: none; border-radius: 9px; padding: 10px 0;
          font: inherit; font-size: 13.5px; font-weight: 600; color: var(--ink-soft); cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }
        .mg-seg-btn.on { background: #fff; color: var(--green); box-shadow: 0 4px 14px -8px rgba(0,0,0,.18); }

        .mg-share-offer-list { display: grid; gap: 10px; }
        .mg-share-offer { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
        .mg-share-offer-top { display: flex; align-items: flex-start; gap: 12px; }
        .mg-share-offer-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .mg-share-reward { flex-shrink: 0; font-size: 12px; color: var(--gold); font-weight: 600; white-space: nowrap; padding-top: 2px; }

        .mg-offer-name-btn {
          display: inline-flex; align-items: center; gap: 4px; align-self: flex-start;
          border: 0; background: none; padding: 0; font: inherit; font-size: 14.5px; font-weight: 600;
          color: var(--ink); cursor: pointer; transition: color .15s ease;
        }
        .mg-offer-name-btn svg { width: 12px; height: 12px; color: var(--ink-soft); transition: transform .15s ease; }
        .mg-offer-name-btn:hover { color: var(--green); }
        .mg-offer-name-btn:hover svg { transform: translateX(2px); color: var(--green); }

        .mg-mini-btn {
          display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
          border: 1px solid var(--green); color: var(--green); background: none;
          border-radius: 10px; padding: 0 16px; font: inherit; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background .2s ease, color .2s ease;
        }
        .mg-mini-btn:hover { background: var(--green); color: #fff; }
        .mg-mini-btn:disabled { border-color: var(--line); color: var(--ink-soft); cursor: not-allowed; }

        .mg-email-row { display: flex; gap: 8px; }
        .mg-email-row .mg-input { flex: 1; min-width: 0; }
        .mg-email-pending {
          display: flex; gap: 12px; background: var(--paper); border-radius: 12px; padding: 14px 16px;
          color: var(--green);
        }

        .mg-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18px; }
        .mg-stat {
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          padding: 14px 12px; display: flex; flex-direction: column; gap: 6px;
        }
        .mg-stat-label { font-size: 11px; color: var(--ink-soft); letter-spacing: .04em; }
        .mg-stat-value { font-size: 19px; }

        .mg-link-list { display: grid; gap: 10px; }
        .mg-link-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; }
        .mg-link-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .mg-link-code-row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 10px; }
        .mg-link-code { font-size: 12.5px; color: var(--ink-soft); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mg-copy-btn {
          display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
          border: 0; background: var(--paper); color: var(--green); border-radius: 999px;
          padding: 5px 11px; font: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer;
        }
        .mg-copy-btn svg { width: 12px; height: 12px; }
        .mg-link-stats { margin-top: 9px; font-size: 12px; color: var(--ink-soft); }
        .mg-link-sep { margin: 0 6px; }

        .mg-event-list { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line); display: grid; gap: 9px; }
        .mg-event-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .mg-event-who { color: var(--ink-soft); flex-shrink: 0; }
        .mg-event-type { flex: 1; color: var(--ink); font-size: 12.5px; }
        .mg-event-status { font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--green); }
        .mg-event-status.pending { color: var(--gold); }
        .mg-event-amt { color: var(--green); font-weight: 600; white-space: nowrap; }
        .mg-event-empty { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line); font-size: 12px; color: var(--ink-soft); }

        /* ---------- Offer activity drill-down ---------- */
        .mg-offer-activity-head { display: flex; align-items: center; gap: 14px; }
        .mg-who-list { display: grid; gap: 10px; }
        .mg-who-card {
          display: flex; align-items: center; gap: 14px;
          background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px;
        }

        /* ---------- Menu drawer — opens from the LEFT ---------- */
        .mg-drawer-layer { position: fixed; inset: 0; z-index: 50; visibility: hidden; }
        .mg-drawer-layer.on { visibility: visible; }
        .mg-drawer-backdrop {
          position: absolute; inset: 0; background: rgba(10, 20, 16, .38);
          opacity: 0; transition: opacity .25s ease; cursor: pointer;
        }
        .mg-drawer-layer.on .mg-drawer-backdrop { opacity: 1; }
        .mg-drawer {
          position: absolute; top: 0; left: 0; bottom: 0; width: min(340px, 86vw);
          background: var(--ivory); box-shadow: 18px 0 40px -20px rgba(0,0,0,.3);
          display: flex; flex-direction: column;
          transform: translateX(-100%); transition: transform .28s cubic-bezier(.32,.72,0,1);
        }
        .mg-drawer-layer.on .mg-drawer { transform: translateX(0); }
        .mg-drawer-top { display: flex; align-items: center; justify-content: space-between; padding: 20px 18px 16px; border-bottom: 1px solid var(--line); }
        .mg-drawer-id { display: flex; align-items: center; gap: 12px; background: none; border: 0; padding: 0; cursor: pointer; text-align: left; }
        .mg-drawer-avatar {
          width: 42px; height: 42px; border-radius: 50%; background: var(--paper) center/cover no-repeat;
          color: var(--green); display: grid; place-items: center; flex-shrink: 0;
        }
        .mg-drawer-name { display: block; font-size: 14.5px; font-weight: 600; color: var(--ink); }
        .mg-drawer-phone { display: block; font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
        .mg-drawer-body { flex: 1; overflow-y: auto; padding: 8px 12px 12px; }
        .mg-drawer-section { margin-top: 14px; }
        .mg-drawer-heading { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); padding: 0 10px 8px; }
        .mg-drawer-item {
          width: 100%; display: flex; align-items: center; gap: 12px;
          background: none; border: 0; border-radius: 11px; padding: 11px 10px;
          font: inherit; font-size: 14px; color: var(--ink); text-align: left; cursor: pointer;
          transition: background .15s ease;
        }
        .mg-drawer-item:hover { background: var(--paper); }
        .mg-drawer-item-icon { width: 30px; height: 30px; border-radius: 9px; background: var(--paper); color: var(--green); display: grid; place-items: center; flex-shrink: 0; }
        .mg-drawer-item-icon svg { width: 15px; height: 15px; }
        .mg-drawer-item-chevron { width: 13px; height: 13px; margin-left: auto; color: var(--ink-soft); flex-shrink: 0; }
        .mg-drawer-logout {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin: 8px 16px 20px; padding: 13px; border-radius: 12px;
          border: 1px solid var(--line); background: none; color: var(--red);
          font: inherit; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .mg-drawer-logout svg { width: 16px; height: 16px; }

        /* ---------- Bottom nav ---------- */
        .mg-nav {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 20;
          background: rgba(251,250,247,.92); backdrop-filter: blur(12px);
          border-top: 1px solid var(--line);
          padding-bottom: env(safe-area-inset-bottom);
        }
        .mg-nav-inner { max-width: 480px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); }
        @media (min-width: 900px) { .mg-nav-inner { max-width: 560px; } }
        .mg-tab {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 11px 0 9px; background: none; border: 0; font: inherit;
          font-size: 11px; font-weight: 500; color: var(--ink-soft); cursor: pointer;
          transition: color .2s ease;
        }
        .mg-tab svg { width: 22px; height: 22px; }
        .mg-tab.on { color: var(--green); font-weight: 600; }

        /* ---------- Profile / activity / support screens ---------- */
        .mg-avatar-block { position: relative; width: 76px; margin: 4px 0 20px; }
        .mg-avatar-circle {
          width: 76px; height: 76px; border-radius: 50%; background: var(--paper) center/cover no-repeat;
          color: var(--green); display: grid; place-items: center; border: 1px solid var(--line);
        }
        .mg-avatar-pencil {
          position: absolute; right: -2px; bottom: -2px; width: 28px; height: 28px; border-radius: 50%;
          background: var(--green); color: #fff; border: 3px solid var(--ivory);
          display: grid; place-items: center; cursor: pointer;
        }
        .mg-profile-strength {
          display: flex; align-items: center; justify-content: space-between;
          background: var(--paper); border-radius: 12px; padding: 12px 14px; margin-bottom: 20px; font-size: 13px;
        }
        .mg-profile-strength-pill { color: var(--green); font-weight: 600; }
        .mg-locked-field {
          display: flex; align-items: center; justify-content: space-between;
          border: 1px solid var(--line); border-radius: 12px; background: var(--paper);
          padding: 13px 16px; font-size: 14px; color: var(--ink-soft);
        }
        .mg-verified { color: var(--green); font-size: 12px; font-weight: 600; }
        .mg-gender-row { display: flex; gap: 10px; }
        .mg-gender-pill {
          flex: 1; border: 1px solid var(--line); background: #fff; border-radius: 12px;
          padding: 12px; font: inherit; font-size: 14px; cursor: pointer; color: var(--ink);
        }
        .mg-gender-pill.on { border-color: var(--green); color: var(--green); font-weight: 600; background: var(--paper); }

        .mg-activity-list { display: grid; gap: 10px; }
        .mg-activity-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px; }
        .mg-activity-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .mg-activity-stats > div { display: flex; flex-direction: column; gap: 3px; font-size: 11.5px; color: var(--ink-soft); }
        .mg-activity-num { font-size: 18px; font-weight: 600; }

        .mg-ticket-confirm { text-align: center; padding: 30px 10px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .mg-email-gate {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          text-align: center; padding: 40px 12px 10px;
        }
        .mg-email-gate-icon {
          width: 48px; height: 48px; border-radius: 50%; background: var(--paper); color: var(--green);
          display: grid; place-items: center; margin-bottom: 4px;
        }

        .mg-faq-list { display: grid; gap: 8px; }
        .mg-faq-item { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        .mg-faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px;
          border: 0; background: none; padding: 14px 16px; font: inherit; font-size: 13.5px; font-weight: 500;
          text-align: left; cursor: pointer; color: var(--ink);
        }
        .mg-faq-q svg { width: 14px; height: 14px; color: var(--ink-soft); flex-shrink: 0; }
        .mg-faq-a { padding: 0 16px 16px; font-size: 13px; color: var(--ink-soft); margin: 0; }

        @media (prefers-reduced-motion: reduce) {
          .mg-card, .mg-splash-mark { animation: none; opacity: 1; transform: none; }
          .mg-drawer, .mg-drawer-backdrop, .mg-icon-btn svg { transition: none; }
        }
      `}</style>

      {phase === "splash" && (
        <div className="mg-splash">
          <Guilloche tone="light" />
          <div className="mg-serif mg-splash-mark">Money<b>Go</b></div>
          <p className="mg-splash-tag">Work hard. Earn smarter.</p>
        </div>
      )}

      {phase === "login" && <LoginScreen onLogin={(d) => { setPhone(d.phone); setPhase("app"); }} />}

      {phase === "app" && (
        <>
          {screen ? (
            <main>
              {screen === "profile" && (
                <ProfileScreen
                  onBack={() => setScreen(null)}
                  name={name} setName={setName}
                  phone={phone} photo={photo} onPhotoChange={setPhoto}
                  email={email} setEmail={setEmail}
                  emailStatus={emailStatus} setEmailStatus={setEmailStatus}
                  emailResendIn={emailResendIn} setEmailResendIn={setEmailResendIn}
                  dob={dob} setDob={setDob}
                  dobLocked={dobLocked} setDobLocked={setDobLocked}
                  gender={gender} setGender={setGender}
                />
              )}
              {screen === "activity" && <ActivityScreen onBack={() => setScreen(null)} />}
              {screen === "notifications" && <NotificationsScreen onBack={() => setScreen(null)} />}
              {screen === "feedback" && (
                <FeedbackContactScreen
                  mode="feedback" onBack={() => setScreen(null)}
                  emailVerified={emailStatus === "verified"}
                  onLinkEmail={() => setScreen("profile")}
                />
              )}
              {screen === "contact" && (
                <FeedbackContactScreen
                  mode="contact" onBack={() => setScreen(null)}
                  emailVerified={emailStatus === "verified"}
                  onLinkEmail={() => setScreen("profile")}
                />
              )}
              {screen === "faqs" && <FaqScreen onBack={() => setScreen(null)} />}
              {screen === "privacy" && <LegalScreen title="Privacy policy" onBack={() => setScreen(null)} />}
              {screen === "terms" && <LegalScreen title="Terms & conditions" onBack={() => setScreen(null)} />}
            </main>
          ) : (
            <>
              <main className="mg-shell">
                {tab === "home" && (
                  <HomeTab onMenu={() => setMenuOpen(true)} onBell={() => nav.openScreen("notifications")} />
                )}
                {tab === "share" && <ShareEarnTab onMenu={() => setMenuOpen(true)} onBell={() => nav.openScreen("notifications")} />}
                {tab === "wallet" && <WalletTab balance={balance} onMenu={() => setMenuOpen(true)} onBell={() => nav.openScreen("notifications")} />}
              </main>

              <nav className="mg-nav" aria-label="Primary">
                <div className="mg-nav-inner">
                  {TABS.map(({ id, label, Ico }) => (
                    <button
                      key={id}
                      className={`mg-tab ${tab === id ? "on" : ""}`}
                      aria-current={tab === id ? "page" : undefined}
                      onClick={() => setTab(id)}
                    >
                      <Ico /> {label}
                    </button>
                  ))}
                </div>
              </nav>
            </>
          )}

          <MenuDrawer
            open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={logout} nav={nav}
            name={name} phone={phone} photo={photo}
          />
        </>
      )}
    </div>
  );
}
