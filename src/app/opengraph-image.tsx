import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Swayam Prajapat — Full-Stack Developer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #1b4965 0%, #62b6cb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#bee9e8",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(190, 233, 232, 0.1) 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: 20,
              textShadow: "2px 2px 0px rgba(27, 73, 101, 0.5)",
            }}
          >
            SWAYAM
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "#cae9ff",
              letterSpacing: "0.05em",
              marginBottom: 30,
            }}
          >
            Full-Stack Developer
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: "rgba(190, 233, 232, 0.8)",
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            Building clean, fast web software from frontend to backend
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 22,
            color: "rgba(190, 233, 232, 0.6)",
            letterSpacing: "0.1em",
          }}
        >
          swayam.cyou
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
