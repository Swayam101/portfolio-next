import { ImageResponse } from "next/og";
import MY_PROJECTS from "@/data/projects";

export const alt = "Project";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const project = MY_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 60,
          background: "#1b4965",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bee9e8",
        }}
      >
        Project
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1b4965 0%, #5fa8d3 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          color: "#bee9e8",
          fontFamily: "sans-serif",
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
            justifyContent: "space-between",
            height: "100%",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: "#cae9ff",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              SWAYAM.CYOU
            </div>
            <div
              style={{
                fontSize: 20,
                color: "rgba(190, 233, 232, 0.6)",
                backgroundColor: "rgba(27, 73, 101, 0.4)",
                padding: "8px 20px",
                borderRadius: "6px",
              }}
            >
              PROJECT
            </div>
          </div>

          {/* Title & Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 25,
            }}
          >
            <div
              style={{
                fontSize: 90,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                textShadow: "3px 3px 0px rgba(27, 73, 101, 0.5)",
              }}
            >
              {project.title}
            </div>
            <div
              style={{
                fontSize: 30,
                color: "rgba(190, 233, 232, 0.85)",
                lineHeight: 1.4,
                maxHeight: 120,
                overflow: "hidden",
              }}
            >
              {project.description}
            </div>
          </div>

          {/* Footer - Tags */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {project.tags.slice(0, 5).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 18,
                  color: "#bee9e8",
                  backgroundColor: "rgba(98, 182, 203, 0.2)",
                  border: "2px solid rgba(98, 182, 203, 0.4)",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
