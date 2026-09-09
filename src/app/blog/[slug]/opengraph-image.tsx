import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/features/blog/db";

export const alt = "Blog Post";
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
  const post = await getPostBySlug(slug);

  if (!post) {
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
        Blog Post
      </div>
    );
  }

  const title = post.seoTitle || post.BLOG_TITLE;
  const description = post.seoDescription || post.SUBTITLE;
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Blog Post";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1b4965 0%, #62b6cb 100%)",
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
              fontSize: 24,
              color: "#cae9ff",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            SWAYAM.CYOU
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 70,
                fontWeight: 900,
                lineHeight: 1.1,
                maxHeight: 280,
                overflow: "hidden",
                textShadow: "2px 2px 0px rgba(27, 73, 101, 0.5)",
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: 28,
                  color: "rgba(190, 233, 232, 0.8)",
                  lineHeight: 1.4,
                  maxHeight: 100,
                  overflow: "hidden",
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: "rgba(190, 233, 232, 0.6)",
              }}
            >
              {dateStr}
            </div>
            <div
              style={{
                fontSize: 22,
                color: "rgba(190, 233, 232, 0.6)",
                backgroundColor: "rgba(27, 73, 101, 0.4)",
                padding: "8px 20px",
                borderRadius: "6px",
              }}
            >
              Blog
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
