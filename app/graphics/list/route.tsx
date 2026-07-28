import { ImageResponse } from "next/og";
import { getCurrentWeek, getWeek } from "@/lib/data";
import type { Movement, RankedQB, Week } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Format = "landscape" | "portrait" | "square";
type GraphicKind = "list" | "qb1";

const SIZES: Record<Format, { width: number; height: number }> = {
  landscape: { width: 1600, height: 900 },
  portrait: { width: 1080, height: 1350 },
  square: { width: 1200, height: 1200 },
};

function movementText(movement: Movement): { label: string; color: string } {
  switch (movement.kind) {
    case "up":
      return { label: `↑${movement.delta}`, color: "#32d583" };
    case "down":
      return { label: `↓${movement.delta}`, color: "#ff5b4a" };
    case "new":
      return { label: "NEW", color: "#ff694f" };
    case "holds":
      return { label: `HOLDS · ${movement.weeks}`, color: "#c9a227" };
    default:
      return { label: "—", color: "#716d67" };
  }
}

function Wordmark({ size = 34 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      }}
    >
      TOP<span style={{ color: "#ff5b3d" }}>10</span>QB
    </div>
  );
}

function ListRow({
  qb,
  compact = false,
}: {
  qb: RankedQB;
  compact?: boolean;
}) {
  const movement = movementText(qb.movement);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: compact ? 88 : 96,
        padding: compact ? "0 24px" : "0 28px",
        marginBottom: compact ? 10 : 12,
        background: qb.rank === 1 ? "rgba(232,70,47,.13)" : "rgba(255,255,255,.045)",
        border: qb.rank === 1 ? "1px solid rgba(255,105,79,.35)" : "1px solid rgba(255,255,255,.065)",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: compact ? 60 : 68,
          color: qb.rank === 1 ? "#ff694f" : "#77736d",
          fontSize: compact ? 37 : 42,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        {String(qb.rank).padStart(2, "0")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          paddingLeft: compact ? 18 : 22,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#f7f4ef",
            fontSize: compact ? 27 : 30,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {qb.name}
        </div>
        <div
          style={{
            display: "flex",
            color: "#8b8780",
            fontSize: compact ? 14 : 15,
            fontWeight: 700,
            letterSpacing: ".18em",
            marginTop: 8,
          }}
        >
          {qb.teamCode}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          color: movement.color,
          fontSize: compact ? 18 : 20,
          fontWeight: 700,
          letterSpacing: ".04em",
        }}
      >
        {movement.label}
      </div>
    </div>
  );
}

function GraphicBackground({
  requestUrl,
  children,
}: {
  requestUrl: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#09090a",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <img
        alt=""
        src={new URL("/graphics/assets/editorial-stadium-texture.png", requestUrl).toString()}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.62,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(115deg, rgba(8,8,9,.05) 0%, rgba(8,8,9,.38) 46%, rgba(8,8,9,.82) 100%)",
        }}
      />
      {children}
    </div>
  );
}

function ListGraphic({
  week,
  format,
  requestUrl,
}: {
  week: Week;
  format: Format;
  requestUrl: string;
}) {
  const ranked = week.ranked.slice().sort((a, b) => a.rank - b.rank);
  const kicker = week.label || `Week ${week.weekNumber}`;

  if (format === "landscape") {
    return (
      <GraphicBackground requestUrl={requestUrl}>
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            padding: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 470,
              height: "100%",
              padding: "16px 54px 12px 8px",
              borderRight: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <Wordmark size={38} />
            <div
              style={{
                display: "flex",
                color: "#ff694f",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                marginTop: 58,
              }}
            >
              {kicker} · {week.displayDate}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#ffffff",
                fontSize: 104,
                fontWeight: 700,
                letterSpacing: "-0.065em",
                lineHeight: 0.82,
                marginTop: 26,
              }}
            >
              THE
              <br />
              LIST
            </div>
            <div
              style={{
                display: "flex",
                color: "#ded9d0",
                fontSize: 27,
                lineHeight: 1.3,
                marginTop: 34,
                maxWidth: 350,
              }}
            >
              The 10 quarterbacks I trust most right now.
            </div>
            <div
              style={{
                display: "flex",
                color: "#8d8880",
                fontSize: 20,
                lineHeight: 1.35,
                marginTop: 16,
                maxWidth: 350,
              }}
            >
              No panel. No model. Just one guy making the list.
            </div>
            <div
              style={{
                display: "flex",
                color: "#c9a227",
                fontSize: 19,
                fontWeight: 700,
                marginTop: "auto",
              }}
            >
              top10qb.com · @top10qb
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              paddingLeft: 46,
              paddingTop: 16,
            }}
          >
            {[ranked.slice(0, 5), ranked.slice(5, 10)].map((column, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  marginLeft: index === 0 ? 0 : 16,
                }}
              >
                {column.map((qb) => (
                  <ListRow key={qb.rank} qb={qb} compact />
                ))}
              </div>
            ))}
          </div>
        </div>
      </GraphicBackground>
    );
  }

  const square = format === "square";
  return (
    <GraphicBackground requestUrl={requestUrl}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: square ? "54px 58px 44px" : "62px 62px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={square ? 38 : 36} />
          <div
            style={{
              display: "flex",
              color: "#a49f97",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            {kicker} · {week.displayDate}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: square ? 34 : 42,
            paddingBottom: square ? 26 : 32,
            borderBottom: "3px solid #ff5b3d",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: square ? 88 : 82,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.86,
            }}
          >
            THE LIST
          </div>
          <div
            style={{
              display: "flex",
              color: "#c9c4bb",
              fontSize: 20,
              lineHeight: 1.25,
              textAlign: "right",
              width: 340,
            }}
          >
            Ten quarterbacks. Ranked by one guy.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: square ? "row" : "column",
            flexWrap: square ? "wrap" : "nowrap",
            marginTop: square ? 26 : 24,
            flex: 1,
          }}
        >
          {ranked.map((qb) => (
            <div
              key={qb.rank}
              style={{
                display: "flex",
                width: square ? "50%" : "100%",
                paddingRight: square && qb.rank <= 5 ? 8 : 0,
                paddingLeft: square && qb.rank > 5 ? 8 : 0,
              }}
            >
              <div style={{ display: "flex", width: "100%" }}>
                <ListRow qb={qb} compact />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8d8880",
            fontSize: 18,
            marginTop: 4,
          }}
        >
          <div style={{ display: "flex" }}>Disagree responsibly.</div>
          <div style={{ display: "flex", color: "#c9a227", fontWeight: 700 }}>
            top10qb.com · @top10qb
          </div>
        </div>
      </div>
    </GraphicBackground>
  );
}

function QB1Graphic({
  week,
  requestUrl,
}: {
  week: Week;
  requestUrl: string;
}) {
  const qb = week.ranked.find((entry) => entry.rank === 1) ?? week.ranked[0];
  const kicker = week.label || `Week ${week.weekNumber}`;
  const [first, ...last] = qb.name.split(" ");

  return (
    <GraphicBackground requestUrl={requestUrl}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "62px 64px 54px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={36} />
          <div
            style={{
              display: "flex",
              color: "#a49f97",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            {kicker} · {week.displayDate}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 30,
            display: "flex",
            color: "rgba(255,255,255,.055)",
            fontSize: 560,
            fontWeight: 700,
            letterSpacing: "-0.09em",
            lineHeight: 0.85,
          }}
        >
          01
        </div>
        <div
          style={{
            display: "flex",
            color: "#ff694f",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            marginTop: 220,
          }}
        >
          The No.1 quarterback in football
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ffffff",
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: "-0.07em",
            lineHeight: 0.78,
            marginTop: 28,
          }}
        >
          {first.toUpperCase()}
          <br />
          {last.join(" ").toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 42,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 14,
              background: qb.teamColor,
              boxShadow: "0 0 0 3px #c9a227",
              marginRight: 14,
            }}
          />
          <div
            style={{
              display: "flex",
              color: "#c9a227",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            {qb.teamName} · QB
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#f2ede5",
            fontSize: 42,
            lineHeight: 1.25,
            marginTop: 56,
            padding: "34px 0 34px 30px",
            borderLeft: "5px solid #ff5b3d",
            maxWidth: 900,
          }}
        >
          “{qb.take || "He is No.1 because that is where I put him."}”
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#89847d",
              fontSize: 18,
              lineHeight: 1.3,
              maxWidth: 560,
            }}
          >
            The ranking is serious. The authority is self-appointed.
          </div>
          <div style={{ display: "flex", color: "#c9a227", fontSize: 19, fontWeight: 700 }}>
            top10qb.com · @top10qb
          </div>
        </div>
      </div>
    </GraphicBackground>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedFormat = url.searchParams.get("format");
  const format: Format =
    requestedFormat === "portrait" || requestedFormat === "square" ? requestedFormat : "landscape";
  const kind: GraphicKind = url.searchParams.get("kind") === "qb1" ? "qb1" : "list";
  const season = Number(url.searchParams.get("season"));
  const weekNumber = Number(url.searchParams.get("week"));
  const historical = Number.isFinite(season) && Number.isFinite(weekNumber) && season > 0 && weekNumber > 0;
  const week = historical ? await getWeek(season, weekNumber) : await getCurrentWeek();

  if (!week) {
    return new Response("No published list found.", { status: 404 });
  }

  const size = kind === "qb1" ? SIZES.portrait : SIZES[format];
  const body =
    kind === "qb1" ? (
      <QB1Graphic week={week} requestUrl={request.url} />
    ) : (
      <ListGraphic week={week} format={format} requestUrl={request.url} />
    );
  const filename = `top10qb-${week.season}-${week.weekNumber}-${kind}-${kind === "qb1" ? "portrait" : format}.png`;

  return new ImageResponse(body, {
    ...size,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Disposition": url.searchParams.get("download") === "1"
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`,
    },
  });
}
