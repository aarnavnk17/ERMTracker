import type { Profile, Vertical } from "@/lib/types";

export function resolveEffectiveVerticalId(
  profile: Profile,
  verticals: Vertical[],
  requestedV?: string
): string {
  if (profile.role === "vertical_head") {
    return profile.vertical_id!;
  }
  if (requestedV && verticals.some((v) => v.id === requestedV)) {
    return requestedV;
  }
  return verticals[0]?.id ?? "";
}
