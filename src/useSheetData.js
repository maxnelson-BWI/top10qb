// ============================================
// TOP10QB — React hook for Google Sheets data
// ============================================
import { useState, useEffect } from "react";
import { fetchSheetData, isSheetConfigured } from "./sheet-fetcher";

// Import static data from rankings-data.js as fallback
import * as staticModule from "./rankings-data.js";

const EMPTY_DATA = {
  CURRENT_WEEK_LABEL: "Rankings",
  CURRENT_DATE: "",
  RANKINGS: [],
  DROPPED: [],
  WORST: { name: "TBD", team: "\u2014", commentary: "Loading...", slug: "tbd" },
  PLAYER_HISTORY: {},
  ARCHIVE_WEEKS: [],
};

function getStaticData() {
  // Try to build fallback from rankings-data.js
  // If any field is missing, use empty defaults
  try {
    return {
      CURRENT_WEEK_LABEL: staticModule.CURRENT_WEEK_LABEL || EMPTY_DATA.CURRENT_WEEK_LABEL,
      CURRENT_DATE: staticModule.CURRENT_DATE || EMPTY_DATA.CURRENT_DATE,
      RANKINGS: staticModule.RANKINGS || EMPTY_DATA.RANKINGS,
      DROPPED: staticModule.DROPPED || EMPTY_DATA.DROPPED,
      WORST: staticModule.WORST || EMPTY_DATA.WORST,
      PLAYER_HISTORY: staticModule.PLAYER_HISTORY || EMPTY_DATA.PLAYER_HISTORY,
      ARCHIVE_WEEKS: staticModule.ARCHIVE_WEEKS || EMPTY_DATA.ARCHIVE_WEEKS,
    };
  } catch (e) {
    return EMPTY_DATA;
  }
}

export function useSheetData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // If Google Sheet isn't configured, use static data
      if (!isSheetConfigured()) {
        setData(getStaticData());
        setLoading(false);
        return;
      }

      try {
        const result = await fetchSheetData();
        if (!cancelled) {
          // If fetch returned empty rankings, fall back to static
          if (!result.RANKINGS || result.RANKINGS.length === 0) {
            setData(getStaticData());
          } else {
            setData(result);
          }
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Sheet data error:", err);
          setError(err.message);
          setData(getStaticData());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 2 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { data, loading, error };
}
