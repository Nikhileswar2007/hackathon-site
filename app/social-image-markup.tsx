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
          "radial-gradient(circle at 18% -12%, rgba(255,158,69,0.28), transparent 44%), radial-gradient(circle at 105% 112%, rgba(111,227,242,0.18), transparent 46%), linear-gradient(160deg, #05070c 0%, #090f19 54%, #020409 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 690,
          height: 690,
          right: -170,
          top: -130,
          borderRadius: "50%",
          border: "2px solid rgba(111,227,242,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 470,
            height: 470,
            borderRadius: "50%",
            border: "1px solid rgba(255,158,69,0.34)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 174,
              height: 174,
              borderRadius: "50%",
              border: "2px solid #ff9e45",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 212,
          top: 178,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#6fe3f2",
          boxShadow: "0 0 26px #6fe3f2",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 74,
          width: 140,
          height: 2,
          background: "#ff9e45",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 88,
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 5,
          color: "#6fe3f2",
          textTransform: "uppercase",
        }}
      >
        IIST India
      </div>
      <div
        style={{
          position: "relative",
          width: 1180,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 76,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 28,
            color: "#edf3fb",
            fontFamily: "sans-serif",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: -6,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 132 }}>KAKSHYA</span>
            <span style={{ fontSize: 78, color: "#ff9e45", letterSpacing: 10 }}>
              2026
            </span>
          </div>
          <div
            style={{
              width: 48,
              height: 108,
              borderLeft: "4px solid #ff9e45",
              borderTop: "4px solid #ff9e45",
              borderRight: "4px solid #6fe3f2",
              marginBottom: 10,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 34,
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#6fe3f2",
            textTransform: "uppercase",
          }}
        >
          48 Hours to Orbit
        </div>
        <div
          style={{
            marginTop: 15,
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 24,
            color: "#9dacc2",
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          IIST National Space Hackathon
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          bottom: 54,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: "sans-serif",
          fontSize: 14,
          letterSpacing: 4,
          color: "#9dacc2",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#ff9e45" }}>Online</span>
        <span>·</span>
        <span>48 Hours</span>
        <span>·</span>
        <span>Two Tracks</span>
      </div>
    </div>
  );
}
