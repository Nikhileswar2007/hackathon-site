export function SocialImageMarkup() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 118%, rgba(255,158,69,0.5), transparent 55%), radial-gradient(circle at 8% -15%, rgba(111,227,242,0.18), transparent 45%), linear-gradient(180deg, #05070c 0%, #090f19 55%, #020409 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #ff9e45 22%, #ffb267 50%, #ff9e45 78%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 118,
          height: 34,
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,158,69,0.4), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 150,
          display: "flex",
          alignItems: "flex-end",
          gap: 26,
        }}
      >
        <svg viewBox="0 0 90 150" width="92" height="150" fill="none">
          <path d="M18 150V34M42 150V10M42 40L64 30" stroke="#9dacc2" strokeWidth="5" />
          <path d="M42 58L64 48M42 86L64 76M42 114L64 104" stroke="#9dacc2" strokeWidth="5" />
          <path d="M42 4l10 12" stroke="#9dacc2" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 90 150" width="90" height="150" fill="none">
          <path
            d="M45 8c12 9 17 27 17 45 0 25-9 43-19 55-6-20-8-43-2-68 2-11 3-21 4-32Z"
            fill="#edf3fb"
          />
          <path d="M45 108L30 138l17-12l17 12" fill="#ff9e45" />
          <circle cx="45" cy="46" r="5.4" fill="#05070c" />
          <path d="M28 128l-9 14M62 128l9 14" stroke="#edf3fb" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 66,
          fontFamily: "sans-serif",
          fontSize: 12,
          letterSpacing: 5,
          color: "#6fe3f2",
          textTransform: "uppercase",
        }}
      >
        IIST PRESENTS
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 92,
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          fontWeight: 900,
          lineHeight: 0.88,
          color: "#edf3fb",
          letterSpacing: -2,
        }}
      >
        <span style={{ fontSize: 120, letterSpacing: 6 }}>KOSMODROME</span>
        <span style={{ marginTop: 16, fontSize: 46, color: "#ff9e45", letterSpacing: 14 }}>
          2026
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 300,
          display: "flex",
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 27,
          color: "#6fe3f2",
          letterSpacing: 7,
          textTransform: "uppercase",
        }}
      >
        48 Hours to Orbit
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 345,
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 19,
          color: "#9dacc2",
          letterSpacing: 3.5,
          textTransform: "uppercase",
        }}
      >
        IIST National Space Hackathon
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          bottom: 46,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: "sans-serif",
          fontSize: 13,
          letterSpacing: 5,
          color: "#9dacc2",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#ff9e45" }}>The Spaceport</span>
        <span>·</span>
        <span>48 Hours</span>
        <span>·</span>
        <span>Two Tracks</span>
      </div>
    </div>
  );
}
