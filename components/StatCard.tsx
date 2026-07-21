/** A centered stat card: big number + uppercase label. Tinted variants. */
export function StatCard({
  value,
  label,
  tone = "neutral",
}: {
  value: string;
  label: string;
  tone?: "neutral" | "green" | "accent";
}) {
  const styles = {
    neutral: {
      bg: "rgba(255,255,255,.05)",
      border: "rgba(255,255,255,.09)",
      value: "#fff",
      label: "#8a8578",
    },
    green: {
      bg: "rgba(63,185,80,.1)",
      border: "rgba(63,185,80,.28)",
      value: "#3fb950",
      label: "#7cbf86",
    },
    accent: {
      bg: "rgba(232,70,47,.1)",
      border: "rgba(232,70,47,.28)",
      value: "#e8462f",
      label: "#c9a89f",
    },
  }[tone];

  return (
    <div
      className="flex-1 text-center rounded-[14px]"
      style={{ background: styles.bg, border: `1px solid ${styles.border}`, padding: "16px 8px" }}
    >
      <div
        className="font-display font-extrabold text-[40px]"
        style={{ color: styles.value, lineHeight: 0.85 }}
      >
        {value}
      </div>
      <div
        className="font-body font-semibold text-[9px] uppercase"
        style={{ letterSpacing: ".12em", color: styles.label, marginTop: 5 }}
      >
        {label}
      </div>
    </div>
  );
}
