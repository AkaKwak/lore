import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ens = searchParams.get("ens") ?? "unknown.eth";
  const vibe = searchParams.get("vibe") ?? "";
  const stamps = searchParams.get("stamps") ?? "0";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#a1a1aa",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Lore
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.1,
            }}
          >
            {ens}
          </div>
          {vibe ? (
            <div
              style={{
                fontSize: 28,
                color: "#a1a1aa",
                fontStyle: "italic",
                marginTop: 8,
              }}
            >
              &ldquo;{vibe}&rdquo;
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: 24,
              fontSize: 20,
              color: "#71717a",
            }}
          >
            <span>{stamps} stamps</span>
            <span style={{ color: "#3f3f46" }}>·</span>
            <span>powered by ENS + Intuition</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
