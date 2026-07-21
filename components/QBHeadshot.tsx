import { espnHeadshot } from "@/lib/reference";

/**
 * Purple portrait card with jersey stripe + gold bottom bar, holding the ESPN
 * cutout headshot. `height` controls the card; the image is centered/contained.
 */
export function QBHeadshot({
  espnId,
  name,
  height = 150,
  bg = "#241773",
  goldBar = true,
}: {
  espnId: number;
  name: string;
  height?: number;
  bg?: string;
  goldBar?: boolean;
}) {
  return (
    <div
      className="stripe relative w-full overflow-hidden rounded-[12px]"
      style={{ height, background: bg, boxShadow: `0 22px 44px -18px ${bg}` }}
    >
      {espnId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={espnHeadshot(espnId, Math.round(height * 2.2), Math.round(height * 1.7))}
          alt={name}
          className="absolute inset-0 h-full w-full object-contain object-bottom"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-body text-[10px] text-white/50">
          {name}
        </div>
      )}
      {goldBar && (
        <div className="absolute left-0 bottom-0 w-full" style={{ height: 5, background: "#c9a227" }} />
      )}
    </div>
  );
}
