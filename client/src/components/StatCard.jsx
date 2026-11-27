const icons = {
  archive: (
    <>
      <path d="M4 4h16v4H4z" />
      <path d="M5 8v12h14V8M9 12h6" />
    </>
  ),
  building: (
    <>
      <path d="M4 21h16M6 21V4h12v17M9 8h2m2 0h2m-6 4h2m2 0h2m-6 4h2m2 0h2M10 21v-3h4v3" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
      <path d="M9 21v-7h6v7" />
    </>
  ),
  message: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L4 20l1.2-3.2A7.2 7.2 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z" />
      <path d="M8 12h8m-8 3h5" />
    </>
  ),
  pause: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6m4-6v6" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  x: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </>
  ),
};

const tones = {
  amber: "from-amber-600 to-orange-700",
  blue: "from-blue-600 to-indigo-700",
  cyan: "from-cyan-700 to-blue-700",
  green: "from-emerald-700 to-teal-700",
  indigo: "from-indigo-600 to-violet-700",
  purple: "from-violet-700 to-fuchsia-700",
  rose: "from-rose-700 to-pink-700",
  slate: "from-slate-600 to-slate-800",
};

function StatCard({ title, value, icon, tone = "blue" }) {
  const gradient = tones[tone] || tones.blue;

  return (
    <div className={`relative isolate overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-md shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl`}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-7 -top-8 h-28 w-28 rounded-full border border-white/20"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 -top-1 h-16 w-16 rounded-full border border-white/15"
      />
      <div className="relative">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/15 text-white shadow-inner backdrop-blur-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            {icons[icon] || icons.building}
          </svg>
        </div>
        <p className="mt-5 text-sm font-medium text-white/80">{title}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
