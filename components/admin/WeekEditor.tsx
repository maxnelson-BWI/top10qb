"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EditableRanking, EditableWeek } from "@/lib/admin-data";
import { TEAMS, TEAM_BY_CODE } from "@/lib/reference";
import { autoMovement, movementLabel } from "@/lib/movement";
import { publishWeek, saveWeek, type ActionResult } from "@/app/admin/actions";

type QBOption = { slug: string; name: string; teamCode: string; espnId: number };

export function WeekEditor({
  initial,
  qbOptions,
  prevRanks,
}: {
  initial: EditableWeek;
  qbOptions: QBOption[];
  prevRanks: Record<string, number>;
}) {
  const router = useRouter();
  const [week, setWeek] = useState<EditableWeek>(initial);
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();
  const [qbQuery, setQbQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const usedSlugs = useMemo(() => new Set(week.ranked.map((r) => r.qbSlug)), [week.ranked]);
  const suggestions = useMemo(() => {
    const q = qbQuery.trim().toLowerCase();
    if (!q) return [];
    return qbOptions
      .filter((o) => !usedSlugs.has(o.slug) && o.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [qbQuery, qbOptions, usedSlugs]);

  // Re-rank helper: keeps rank = index + 1 after any reorder/add/remove.
  function renumber(list: EditableRanking[]): EditableRanking[] {
    return list.map((r, i) => ({ ...r, rank: i + 1 }));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setWeek((w) => {
      const oldIdx = w.ranked.findIndex((r) => r.qbSlug === active.id);
      const newIdx = w.ranked.findIndex((r) => r.qbSlug === over.id);
      return { ...w, ranked: renumber(arrayMove(w.ranked, oldIdx, newIdx)) };
    });
  }

  function addRanked(qbSlug: string, name: string, teamCode: string) {
    setWeek((w) => ({
      ...w,
      ranked: renumber([
        ...w.ranked,
        { rank: w.ranked.length + 1, qbSlug, name, teamCode, take: "", movement: { kind: "same" } },
      ]),
    }));
    setQbQuery("");
  }

  function addQB(o: QBOption) {
    addRanked(o.slug, o.name, o.teamCode);
  }

  // Fallback: add a QB the roster list doesn't have yet (no headshot until an
  // ESPN id is added, but you're never blocked from ranking someone).
  function addCustom(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const slug = "custom-" + slugify(trimmed);
    addRanked(slug, trimmed, "BAL");
  }

  const exactMatch = qbOptions.some(
    (o) => o.name.toLowerCase() === qbQuery.trim().toLowerCase(),
  );

  // Removing a QB from the top 10 auto-adds them to "Dropped Out" (with their
  // rank from last week where known, else their current rank).
  function removeQB(slug: string) {
    setWeek((w) => {
      const removed = w.ranked.find((r) => r.qbSlug === slug);
      const ranked = renumber(w.ranked.filter((r) => r.qbSlug !== slug));
      let droppedOut = w.droppedOut;
      if (removed && !droppedOut.some((d) => d.name === removed.name)) {
        droppedOut = [
          ...droppedOut,
          { name: removed.name, previousRank: prevRanks[slug] ?? removed.rank },
        ];
      }
      return { ...w, ranked, droppedOut };
    });
  }

  function updateRow(slug: string, patch: Partial<EditableRanking>) {
    setWeek((w) => ({
      ...w,
      ranked: w.ranked.map((r) => (r.qbSlug === slug ? { ...r, ...patch } : r)),
    }));
  }

  // Bake auto movement into the saved payload.
  function withComputedMovement(w: EditableWeek): EditableWeek {
    return {
      ...w,
      ranked: w.ranked.map((r) => ({
        ...r,
        movement: autoMovement(r.rank, prevRanks[r.qbSlug]),
      })),
    };
  }

  function run(fn: () => Promise<ActionResult>, successMsg: string) {
    setMsg("");
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        setMsg(successMsg);
        if (res.id && res.id !== week.id) router.replace(`/admin/week/${res.id}`);
        router.refresh();
      } else {
        setMsg(res.error ?? "Something went wrong.");
      }
    });
  }

  const onSaveDraft = () => run(() => saveWeek(withComputedMovement(week)), "Saved as draft.");
  const onPublish = () =>
    run(async () => {
      const saved = await saveWeek(withComputedMovement(week));
      if (!saved.ok || !saved.id) return saved;
      return publishWeek(saved.id);
    }, "Published. It's live on the site.");

  return (
    <div className="pb-28">
      {/* Meta */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3">
        <Field label="Season">
          <input type="number" value={week.season} onChange={(e) => setWeek({ ...week, season: Number(e.target.value) })} style={inputStyle} />
        </Field>
        <Field label="Week #">
          <input type="number" value={week.weekNumber} onChange={(e) => setWeek({ ...week, weekNumber: Number(e.target.value) })} style={inputStyle} />
        </Field>
        <Field label="Display date">
          <input value={week.displayDate} placeholder="Dec 10, 2024" onChange={(e) => setWeek({ ...week, displayDate: e.target.value })} style={inputStyle} />
        </Field>
        <div className="col-span-2">
          <Field label="List label (optional) — shows instead of “Week N”">
            <input value={week.label} placeholder='e.g. "Offseason Rankings 1"' onChange={(e) => setWeek({ ...week, label: e.target.value })} style={inputStyle} />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Archive blurb — the one-liner under the #1 on the Archive page">
            <input value={week.archiveNote} placeholder='e.g. "Bought the courthouse. Renamed it."' onChange={(e) => setWeek({ ...week, archiveNote: e.target.value })} style={inputStyle} />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="#1 hero image override (optional) — normally auto-uses the QB's action shot">
            <input value={week.heroImageUrl} placeholder="Leave blank: uses /actions/<qb>.jpg, else the headshot" onChange={(e) => setWeek({ ...week, heroImageUrl: e.target.value })} style={inputStyle} />
          </Field>
        </div>
      </div>

      {/* Top 10 */}
      <SectionLabel>The Top 10 · drag to reorder</SectionLabel>
      <div className="px-5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={week.ranked.map((r) => r.qbSlug)} strategy={verticalListSortingStrategy}>
            {week.ranked.map((r) => (
              <SortableRow
                key={r.qbSlug}
                row={r}
                prevRank={prevRanks[r.qbSlug]}
                onRemove={() => removeQB(r.qbSlug)}
                onChangeTake={(take) => updateRow(r.qbSlug, { take })}
                onChangeTeam={(teamCode) => updateRow(r.qbSlug, { teamCode })}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Add QB */}
        <div className="relative mt-3">
          <input
            value={qbQuery}
            onChange={(e) => setQbQuery(e.target.value)}
            placeholder="+ Add a quarterback…"
            style={inputStyle}
          />
          {qbQuery.trim() && (suggestions.length > 0 || !exactMatch) && (
            <div className="absolute left-0 right-0 z-10 mt-1 rounded-[10px] overflow-hidden" style={{ background: "#161318", border: "1px solid rgba(255,255,255,.12)" }}>
              {suggestions.map((o) => (
                <button
                  key={o.slug}
                  onClick={() => addQB(o)}
                  className="w-full text-left font-body text-[14px] text-white cursor-pointer"
                  style={{ padding: "10px 12px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,.06)" }}
                >
                  {o.name} <span style={{ color: "#8a8578" }}>· {o.teamCode}</span>
                </button>
              ))}
              {!exactMatch && (
                <button
                  onClick={() => addCustom(qbQuery)}
                  className="w-full text-left font-body text-[14px] cursor-pointer"
                  style={{ padding: "10px 12px", background: "transparent", border: "none", color: "#c9a227" }}
                >
                  + Add “{qbQuery.trim()}” (custom — set team below)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Worst QB */}
      <SectionLabel>Worst QB of the Week</SectionLabel>
      <div className="px-5 flex flex-col gap-2">
        <input value={week.worstName} placeholder="Name (or a bit)" onChange={(e) => setWeek({ ...week, worstName: e.target.value })} style={inputStyle} />
        <textarea value={week.worstTake} placeholder="The roast…" onChange={(e) => setWeek({ ...week, worstTake: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} />
      </div>

      {/* Dropped out */}
      <SectionLabel>Dropped Out</SectionLabel>
      <div className="px-5 flex flex-col gap-2">
        {week.droppedOut.map((d, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={d.name}
              placeholder="Name"
              onChange={(e) =>
                setWeek({ ...week, droppedOut: week.droppedOut.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })
              }
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              type="number"
              value={d.previousRank}
              onChange={(e) =>
                setWeek({ ...week, droppedOut: week.droppedOut.map((x, j) => (j === i ? { ...x, previousRank: Number(e.target.value) } : x)) })
              }
              style={{ ...inputStyle, width: 80 }}
            />
            <button onClick={() => setWeek({ ...week, droppedOut: week.droppedOut.filter((_, j) => j !== i) })} style={removeBtnStyle}>
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => setWeek({ ...week, droppedOut: [...week.droppedOut, { name: "", previousRank: 0 }] })}
          className="font-body font-bold text-[12px] uppercase self-start cursor-pointer"
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,.18)", color: "#c9c4bb", padding: "8px 12px", borderRadius: 8, letterSpacing: ".04em" }}
        >
          + Add dropped QB
        </button>
      </div>

      {/* Sticky action bar */}
      <div
        className="fixed left-0 right-0 bottom-0 z-40"
        style={{ background: "rgba(11,10,12,.94)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,.1)" }}
      >
        <div className="mx-auto flex items-center gap-2 px-5 py-3" style={{ maxWidth: 480 }}>
          <button onClick={onSaveDraft} disabled={pending} className="flex-1 rounded-[10px] font-body font-bold text-[13px] uppercase cursor-pointer" style={{ background: "transparent", border: "1px solid rgba(255,255,255,.22)", color: "#c9c4bb", padding: "13px", letterSpacing: ".04em", opacity: pending ? 0.6 : 1 }}>
            Save draft
          </button>
          <button onClick={onPublish} disabled={pending} className="flex-1 rounded-[10px] font-body font-bold text-[13px] uppercase text-white cursor-pointer" style={{ background: "#e8462f", border: "none", padding: "13px", letterSpacing: ".04em", opacity: pending ? 0.6 : 1 }}>
            {pending ? "Working…" : "Publish"}
          </button>
        </div>
        {msg && (
          <div className="text-center font-body font-semibold text-[12px] pb-2" style={{ color: "#c9a227" }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

function SortableRow({
  row,
  prevRank,
  onRemove,
  onChangeTake,
  onChangeTeam,
}: {
  row: EditableRanking;
  prevRank: number | undefined;
  onRemove: () => void;
  onChangeTake: (v: string) => void;
  onChangeTeam: (v: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.qbSlug });
  const mv = movementLabel(autoMovement(row.rank, prevRank));
  const color = TEAM_BY_CODE[row.teamCode]?.primaryColor ?? "#8a8578";

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        background: "#100f12",
        border: "1px solid rgba(255,255,255,.08)",
        borderLeft: `4px solid ${color}`,
        borderRadius: 12,
        marginBottom: 8,
      }}
    >
      <div className="flex items-center gap-2" style={{ padding: "10px 12px" }}>
        <button {...attributes} {...listeners} className="cursor-grab touch-none font-body text-[18px]" style={{ color: "#6b6862", background: "transparent", border: "none", padding: "0 4px" }} aria-label="Drag">
          ⠿
        </button>
        <span className="font-display font-extrabold text-[24px] text-white" style={{ width: 28 }}>
          {row.rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-body font-bold text-[15px] text-white truncate">{row.name}</div>
          <select
            value={row.teamCode}
            onChange={(e) => onChangeTeam(e.target.value)}
            className="font-body text-[11px] uppercase mt-[2px]"
            style={{ background: "transparent", color: "#8a8578", border: "none", letterSpacing: ".05em", outline: "none" }}
          >
            {TEAMS.map((t) => (
              <option key={t.code} value={t.code} style={{ background: "#161318", color: "#fff" }}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <span className="font-body font-bold text-[12px] whitespace-nowrap" style={{ color: mv.color }}>
          {row.rank === 1 && prevRank === 1 ? "HOLDS" : mv.label}
        </span>
        <button onClick={onRemove} style={removeBtnStyle} aria-label="Remove">
          ✕
        </button>
      </div>
      <div style={{ padding: "0 12px 12px" }}>
        <textarea
          value={row.take}
          onChange={(e) => onChangeTake(e.target.value)}
          placeholder={`The take on ${row.name.split(" ")[0]}…`}
          style={{ ...inputStyle, minHeight: 56, resize: "vertical", fontFamily: "var(--font-body)" }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-body font-semibold text-[10px] uppercase" style={{ letterSpacing: ".1em", color: "#6b6862" }}>
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body font-bold text-[11px] uppercase px-5 pt-5 pb-2" style={{ letterSpacing: ".2em", color: "#6b6862" }}>
      {children}
    </div>
  );
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.'']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,.35)",
  border: "1px solid rgba(255,255,255,.15)",
  borderRadius: 10,
  padding: "11px 12px",
  font: "500 14px var(--font-body)",
  color: "#fff",
  outline: "none",
};

const removeBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,.14)",
  color: "#8a8578",
  borderRadius: 8,
  width: 34,
  height: 34,
  flexShrink: 0,
  cursor: "pointer",
};
