// ============================================
// TOP10QB — React hook for Google Sheets data
// ============================================
// Usage in App.jsx:
//   import { useSheetData } from "./useSheetData";
//   const { data, loading, error } = useSheetData();
// ============================================

import { useState, useEffect } from "react";
import { fetchSheetData, isSheetConfigured } from "./sheet-fetcher";

// Static fallback (used before Google Sheet is connected)
import {
  CURRENT_WEEK_LABEL, CURRENT_DATE, RANKINGS, DROPPED,
  WORST, PLAYER_HISTORY, ARCHIVE_WEEKS,
} from "./rankings-data.js";

function getStaticData() {
  return {
    CURRENT_WEEK_LABEL, CURRENT_DATE, RANKINGS, DROPPED,
    WORST, PLAYER_HISTORY, ARCHIVE_WEEKS,
  };
}

export function useSheetData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isSheetConfigured()) {
        setData(getStaticData());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchSheetData();
        if (!cancelled) { setData(result); setError(null); }
      } catch (err) {
        if (!cancelled) { setError(err.message); setData(getStaticData()); }
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
