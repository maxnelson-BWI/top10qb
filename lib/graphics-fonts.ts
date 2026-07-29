/**
 * Font data for the social graphics (`/graphics/list`).
 *
 * next/og renders through satori, which needs raw font buffers — it cannot use
 * the CSS variables that next/font/google injects for the website. So the same
 * two families the site uses (Big Shoulders for display, Barlow for body) are
 * committed as static TTFs under public/graphics/assets/fonts and read from
 * disk here.
 *
 * Read from disk, never fetched: hitting Google on every request would make the
 * route slow and put an outage between us and our own graphics. The buffers are
 * cached in module scope so a warm lambda reads them once.
 *
 * These files are pulled into the serverless bundle by `outputFileTracingIncludes`
 * in next.config.mjs — Next cannot trace a runtime path.join, so that entry is
 * load-bearing. Removing it breaks the route in production only.
 */
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type GraphicFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700 | 800 | 900;
  style: "normal";
};

const FONT_DIR = path.join(process.cwd(), "public", "graphics", "assets", "fonts");

const FILES: { file: string; name: string; weight: GraphicFont["weight"] }[] = [
  { file: "BigShoulders-Bold.ttf", name: "Big Shoulders", weight: 700 },
  { file: "BigShoulders-ExtraBold.ttf", name: "Big Shoulders", weight: 800 },
  { file: "BigShoulders-Black.ttf", name: "Big Shoulders", weight: 900 },
  { file: "Barlow-Regular.ttf", name: "Barlow", weight: 400 },
  { file: "Barlow-SemiBold.ttf", name: "Barlow", weight: 600 },
  { file: "Barlow-Bold.ttf", name: "Barlow", weight: 700 },
];

let cached: Promise<GraphicFont[]> | null = null;

async function load(): Promise<GraphicFont[]> {
  return Promise.all(
    FILES.map(async ({ file, name, weight }) => {
      const buf = await readFile(path.join(FONT_DIR, file));
      return {
        name,
        // Slice to a standalone ArrayBuffer — Node Buffers are views into a
        // shared pool, and satori reads the whole underlying buffer.
        data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
        weight,
        style: "normal" as const,
      };
    }),
  );
}

export function graphicFonts(): Promise<GraphicFont[]> {
  cached ??= load();
  return cached;
}

/** Family names, so the graphic components and this module can't drift apart. */
export const DISPLAY_FONT = "Big Shoulders";
export const BODY_FONT = "Barlow";
