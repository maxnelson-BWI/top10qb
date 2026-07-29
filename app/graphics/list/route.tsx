import { ImageResponse } from "next/og";
import { getCurrentWeek, getWeek } from "@/lib/data";
import { BODY_FONT, DISPLAY_FONT, graphicFonts } from "@/lib/graphics-fonts";
import {
  LANDSCAPE_LEAD,
  LANDSCAPE_SUB,
  LIST_FOOTER,
  LIST_HEADER,
  QB1_FALLBACK_TAKE,
  QB1_FOOTER,
  QB1_KICKER,
  SITE_FOOTER,
  parseVariant,
  type Variant,
} from "@/lib/graphics-copy";
import { listName } from "@/lib/site";
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
        fontFamily: DISPLAY_FONT,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: "-0.02em",
      }}
    >
      TOP<span style={{ color: "#ff5b3d" }}>10</span>QB
    </div>
  );
}

/** The small uppercase "<list name> · <date>" line. Always from published data. */
function Kicker({ week, color = "#a49f97", size = 15 }: { week: Week; color?: string; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        color,
        fontFamily: BODY_FONT,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: ".18em",
        textTransform: "uppercase",
      }}
    >
      {listName(week)} · {week.displayDate}
    </div>
  );
}

function SiteFooter({ size = 19 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        color: "#c9a227",
        fontFamily: BODY_FONT,
        fontSize: size,
        fontWeight: 700,
      }}
    >
      {SITE_FOOTER}
    </div>
  );
}

type RowSpec = {
  rankSize: number;
  rankWidth: number;
  nameSize: number;
  teamSize: number;
  moveSize: number;
  padX: number;
  gap: number;
};

/**
 * One ranked QB. Rows are `flex: 1` rather than fixed-height so a column of
 * them always fills its container — that's what keeps the bottom of the frame
 * from going empty when the format changes.
 */
function ListRow({
  qb,
  spec,
  last,
  chrome = "card",
}: {
  qb: RankedQB;
  spec: RowSpec;
  last: boolean;
  chrome?: "card" | "rule";
}) {
  const movement = movementText(qb.movement);
  const isNo1 = qb.rank === 1;

  // Built as a separate object rather than inline ternaries: satori reads this
  // style object literally and throws on any key whose value is `undefined`.
  const chromeStyle: React.CSSProperties =
    chrome === "card"
      ? {
          background: isNo1 ? "rgba(232,70,47,.13)" : "rgba(255,255,255,.045)",
          border: isNo1 ? "1px solid rgba(255,105,79,.35)" : "1px solid rgba(255,255,255,.065)",
          borderRadius: 14,
        }
      : {
          background: isNo1 ? "rgba(232,70,47,.1)" : "transparent",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        flex: 1,
        padding: `0 ${spec.padX}px`,
        marginBottom: last ? 0 : spec.gap,
        ...chromeStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: spec.rankWidth,
          color: isNo1 ? "#ff694f" : "#77736d",
          fontFamily: DISPLAY_FONT,
          fontSize: spec.rankSize,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        {String(qb.rank).padStart(2, "0")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          paddingLeft: Math.round(spec.padX * 0.8),
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#f7f4ef",
            fontFamily: DISPLAY_FONT,
            fontSize: spec.nameSize,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            lineHeight: 1,
          }}
        >
          {qb.name}
        </div>
        <div
          style={{
            display: "flex",
            color: "#8b8780",
            fontFamily: BODY_FONT,
            fontSize: spec.teamSize,
            fontWeight: 700,
            letterSpacing: ".18em",
            marginTop: 7,
          }}
        >
          {qb.teamCode}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          color: movement.color,
          fontFamily: BODY_FONT,
          fontSize: spec.moveSize,
          fontWeight: 700,
          letterSpacing: ".04em",
        }}
      >
        {movement.label}
      </div>
    </div>
  );
}

/** A full-height column of rows. Rows flex, so the column always bottoms out. */
function RankColumn({
  qbs,
  spec,
  chrome,
  marginLeft = 0,
}: {
  qbs: RankedQB[];
  spec: RowSpec;
  chrome?: "card" | "rule";
  marginLeft?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
        marginLeft,
      }}
    >
      {qbs.map((qb, i) => (
        <ListRow key={qb.rank} qb={qb} spec={spec} chrome={chrome} last={i === qbs.length - 1} />
      ))}
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
        // Body default; display elements opt into Big Shoulders explicitly.
        fontFamily: BODY_FONT,
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

/* ---------------------------------------------------------------- landscape */

const LANDSCAPE_SPEC: RowSpec = {
  rankSize: 58,
  rankWidth: 76,
  nameSize: 38,
  teamSize: 16,
  moveSize: 22,
  padX: 26,
  gap: 14,
};

/** Variant A — left rail, two columns of five filling the full frame height. */
function LandscapeRail({ week, requestUrl, variant }: { week: Week; requestUrl: string; variant: Variant }) {
  const ranked = week.ranked.slice().sort((a, b) => a.rank - b.rank);

  return (
    <GraphicBackground requestUrl={requestUrl}>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 52,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 460,
            height: "100%",
            padding: "6px 52px 6px 6px",
            borderRight: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <Wordmark size={44} />
          <div style={{ display: "flex", marginTop: 46 }}>
            <Kicker week={week} color="#ff694f" size={17} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
              fontFamily: DISPLAY_FONT,
              fontSize: 132,
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 0.8,
              marginTop: 22,
            }}
          >
            THE
            <br />
            LIST
          </div>
          {/* Pushed to the bottom of the rail so the panel reads as two anchored
              clusters rather than a stack with slack underneath it. */}
          <div
            style={{
              display: "flex",
              color: "#ded9d0",
              fontFamily: BODY_FONT,
              fontSize: 30,
              lineHeight: 1.3,
              marginTop: "auto",
              maxWidth: 390,
            }}
          >
            {LANDSCAPE_LEAD[variant]}
          </div>
          <div
            style={{
              display: "flex",
              color: "#8d8880",
              fontFamily: BODY_FONT,
              fontSize: 22,
              lineHeight: 1.35,
              marginTop: 18,
              maxWidth: 390,
            }}
          >
            {LANDSCAPE_SUB[variant]}
          </div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <SiteFooter size={20} />
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, height: "100%", paddingLeft: 44 }}>
          <RankColumn qbs={ranked.slice(0, 5)} spec={LANDSCAPE_SPEC} />
          <RankColumn qbs={ranked.slice(5, 10)} spec={LANDSCAPE_SPEC} marginLeft={16} />
        </div>
      </div>
    </GraphicBackground>
  );
}

/** Variant B — full-width banner header, then two columns of five beneath it. */
function LandscapeBanner({ week, requestUrl, variant }: { week: Week; requestUrl: string; variant: Variant }) {
  const ranked = week.ranked.slice().sort((a, b) => a.rank - b.rank);

  return (
    <GraphicBackground requestUrl={requestUrl}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "48px 56px 44px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={40} />
          <Kicker week={week} color="#ff694f" size={17} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: 26,
            paddingBottom: 24,
            borderBottom: "3px solid #ff5b3d",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontFamily: DISPLAY_FONT,
              fontSize: 116,
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 0.84,
            }}
          >
            THE LIST
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              width: 660,
              paddingBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#ded9d0",
                fontFamily: BODY_FONT,
                fontSize: 26,
                lineHeight: 1.3,
                textAlign: "right",
              }}
            >
              {LANDSCAPE_LEAD[variant]}
            </div>
            <div
              style={{
                display: "flex",
                color: "#8d8880",
                fontFamily: BODY_FONT,
                fontSize: 20,
                lineHeight: 1.35,
                marginTop: 10,
                textAlign: "right",
              }}
            >
              {LANDSCAPE_SUB[variant]}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, marginTop: 22 }}>
          <RankColumn qbs={ranked.slice(0, 5)} spec={LANDSCAPE_SPEC} chrome="rule" />
          <RankColumn qbs={ranked.slice(5, 10)} spec={LANDSCAPE_SPEC} chrome="rule" marginLeft={40} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#8d8880",
              fontFamily: BODY_FONT,
              fontSize: 19,
            }}
          >
            {LIST_FOOTER[variant]}
          </div>
          <SiteFooter size={19} />
        </div>
      </div>
    </GraphicBackground>
  );
}

/* --------------------------------------------------------- portrait / square */

const PORTRAIT_SPEC: RowSpec = {
  rankSize: 46,
  rankWidth: 66,
  nameSize: 34,
  teamSize: 15,
  moveSize: 20,
  padX: 24,
  gap: 10,
};

const SQUARE_SPEC: RowSpec = {
  rankSize: 54,
  rankWidth: 72,
  nameSize: 36,
  teamSize: 15,
  moveSize: 21,
  padX: 24,
  gap: 12,
};

function StackedList({
  week,
  format,
  requestUrl,
  variant,
}: {
  week: Week;
  format: "portrait" | "square";
  requestUrl: string;
  variant: Variant;
}) {
  const ranked = week.ranked.slice().sort((a, b) => a.rank - b.rank);
  const square = format === "square";
  const spec = square ? SQUARE_SPEC : PORTRAIT_SPEC;
  // Variant B trades the card chrome for editorial hairlines.
  const chrome = variant === "b" ? "rule" : "card";

  return (
    <GraphicBackground requestUrl={requestUrl}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: square ? "50px 56px 42px" : "56px 58px 44px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={square ? 42 : 40} />
          <Kicker week={week} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: square ? 28 : 32,
            paddingBottom: square ? 22 : 24,
            borderBottom: "3px solid #ff5b3d",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontFamily: DISPLAY_FONT,
              fontSize: square ? 104 : 96,
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 0.84,
            }}
          >
            THE LIST
          </div>
          <div
            style={{
              display: "flex",
              color: "#c9c4bb",
              fontFamily: BODY_FONT,
              fontSize: 21,
              lineHeight: 1.25,
              textAlign: "right",
              width: square ? 360 : 330,
              paddingBottom: 6,
            }}
          >
            {LIST_HEADER[variant]}
          </div>
        </div>

        {/* Square runs two columns of five; portrait runs one of ten. Both are
            flex children so the block always reaches the footer.

            Written as two separate containers rather than one with a fragment
            inside: satori doesn't treat a fragment's children as flex children,
            so `<>` here collapses the two columns on top of each other. */}
        {square ? (
          <div style={{ display: "flex", flex: 1, marginTop: 22 }}>
            <RankColumn qbs={ranked.slice(0, 5)} spec={spec} chrome={chrome} />
            <RankColumn qbs={ranked.slice(5, 10)} spec={spec} chrome={chrome} marginLeft={20} />
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, marginTop: 20 }}>
            <RankColumn qbs={ranked} spec={spec} chrome={chrome} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#8d8880",
              fontFamily: BODY_FONT,
              fontSize: 19,
            }}
          >
            {LIST_FOOTER[variant]}
          </div>
          <SiteFooter size={19} />
        </div>
      </div>
    </GraphicBackground>
  );
}

/* --------------------------------------------------------------------- qb1 */

/** Variant A — name high, quote flexed into the space that used to be empty. */
function QB1Standard({ week, requestUrl, variant }: { week: Week; requestUrl: string; variant: Variant }) {
  const qb = week.ranked.find((entry) => entry.rank === 1) ?? week.ranked[0];
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
          padding: "56px 60px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={40} />
          <Kicker week={week} />
        </div>
        {/* Sized and placed to carry the middle of the frame — it's the element
            that keeps the band between the name and the quote from reading as
            empty rather than composed. */}
        <div
          style={{
            position: "absolute",
            top: 210,
            right: -40,
            display: "flex",
            color: "rgba(255,255,255,.05)",
            fontFamily: DISPLAY_FONT,
            fontSize: 820,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.82,
          }}
        >
          01
        </div>
        <div
          style={{
            display: "flex",
            color: "#ff694f",
            fontFamily: BODY_FONT,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            marginTop: 96,
          }}
        >
          {QB1_KICKER}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ffffff",
            fontFamily: DISPLAY_FONT,
            fontSize: 156,
            fontWeight: 900,
            letterSpacing: "-0.025em",
            lineHeight: 0.82,
            marginTop: 22,
          }}
        >
          {first.toUpperCase()}
          <br />
          {last.join(" ").toUpperCase()}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 30 }}>
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
              fontFamily: BODY_FONT,
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            {qb.teamName} · QB
          </div>
        </div>
        {/* Anchored to the bottom of the frame rather than centred in the slack,
            so the quote and footer form one cluster under the name block. The
            rule sizes to the quote instead of stretching over empty space. */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            paddingLeft: 34,
            borderLeft: "6px solid #ff5b3d",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#f2ede5",
              fontFamily: BODY_FONT,
              fontSize: 58,
              lineHeight: 1.22,
              maxWidth: 900,
            }}
          >
            “{qb.take || QB1_FALLBACK_TAKE[variant]}”
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#89847d",
              fontFamily: BODY_FONT,
              fontSize: 19,
              lineHeight: 1.3,
              maxWidth: 600,
            }}
          >
            {QB1_FOOTER[variant]}
          </div>
          <SiteFooter size={19} />
        </div>
      </div>
    </GraphicBackground>
  );
}

/** Variant B — quote-led: the take is the headline, the name is the payoff. */
function QB1QuoteLed({ week, requestUrl, variant }: { week: Week; requestUrl: string; variant: Variant }) {
  const qb = week.ranked.find((entry) => entry.rank === 1) ?? week.ranked[0];
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
          padding: "56px 60px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={40} />
          <Kicker week={week} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -50,
            display: "flex",
            color: "rgba(255,255,255,.05)",
            fontFamily: DISPLAY_FONT,
            fontSize: 780,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.82,
          }}
        >
          01
        </div>

        {/* Kicker travels with the quote rather than sitting alone under the
            header — one centred cluster instead of two stranded ones. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ff694f",
              fontFamily: BODY_FONT,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              marginBottom: 26,
            }}
          >
            {QB1_KICKER}
          </div>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontFamily: BODY_FONT,
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.14,
            }}
          >
            “{qb.take || QB1_FALLBACK_TAKE[variant]}”
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: 30,
            borderTop: "3px solid #ff5b3d",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontFamily: DISPLAY_FONT,
              fontSize: 120,
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 0.86,
            }}
          >
            {`${first} ${last.join(" ")}`.toUpperCase()}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
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
                fontFamily: BODY_FONT,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              {qb.teamName} · QB
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#89847d",
              fontFamily: BODY_FONT,
              fontSize: 19,
              lineHeight: 1.3,
              maxWidth: 600,
            }}
          >
            {QB1_FOOTER[variant]}
          </div>
          <SiteFooter size={19} />
        </div>
      </div>
    </GraphicBackground>
  );
}

/* ------------------------------------------------------------------- route */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedFormat = url.searchParams.get("format");
  const format: Format =
    requestedFormat === "portrait" || requestedFormat === "square" ? requestedFormat : "landscape";
  const kind: GraphicKind = url.searchParams.get("kind") === "qb1" ? "qb1" : "list";
  const variant = parseVariant(url.searchParams.get("variant"));
  const season = Number(url.searchParams.get("season"));
  const weekNumber = Number(url.searchParams.get("week"));
  const historical = Number.isFinite(season) && Number.isFinite(weekNumber) && season > 0 && weekNumber > 0;
  const week = historical ? await getWeek(season, weekNumber) : await getCurrentWeek();

  if (!week) {
    return new Response("No published list found.", { status: 404 });
  }

  const size = kind === "qb1" ? SIZES.portrait : SIZES[format];

  let body: React.ReactElement;
  if (kind === "qb1") {
    body =
      variant === "b" ? (
        <QB1QuoteLed week={week} requestUrl={request.url} variant={variant} />
      ) : (
        <QB1Standard week={week} requestUrl={request.url} variant={variant} />
      );
  } else if (format === "landscape") {
    body =
      variant === "b" ? (
        <LandscapeBanner week={week} requestUrl={request.url} variant={variant} />
      ) : (
        <LandscapeRail week={week} requestUrl={request.url} variant={variant} />
      );
  } else {
    body = <StackedList week={week} format={format} requestUrl={request.url} variant={variant} />;
  }

  const shape = kind === "qb1" ? "portrait" : format;
  const filename = `top10qb-${week.season}-${week.weekNumber}-${kind}-${shape}-${variant}.png`;

  return new ImageResponse(body, {
    ...size,
    fonts: await graphicFonts(),
    headers: {
      // Always render fresh. The old `s-maxage=3600, stale-while-revalidate`
      // let Vercel's CDN serve an hour-old PNG (and up to a day stale), so
      // fixing a date in /admin left the graphic showing the old one with no
      // way to force it — revalidatePath doesn't reach a route handler's CDN
      // entry. Downloading a graphic with last week's date on it costs more
      // than the ~1s it takes to re-render.
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Disposition": url.searchParams.get("download") === "1"
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`,
    },
  });
}
