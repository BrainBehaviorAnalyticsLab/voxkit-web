import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { RELEASES_CACHE_TAG } from "../../../lib/releases";

/**
 * Cron target, wired to midnight UTC daily in `vercel.json`.
 *
 * Drops both the cached GitHub response and the prerendered download page, so
 * the first visitor after midnight triggers one fresh fetch. New releases are
 * therefore picked up with up to a day's delay — a deliberate grace period in
 * case a release turns out to be problematic.
 *
 * Vercel signs cron requests with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("CRON_SECRET is not configured; refusing to revalidate.");
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(RELEASES_CACHE_TAG, "max");
  revalidatePath("/download");

  return NextResponse.json({
    revalidated: true,
    at: new Date().toISOString(),
  });
}
