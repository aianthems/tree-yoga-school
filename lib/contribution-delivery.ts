import sharp from "sharp";
import { createHash } from "node:crypto";
import { ContributionError, contributionText, maxPhotoBytes, maxPhotoCount, photoTypes, type Contribution } from "./contributions";
import { schoolContactEmail } from "./school-contact";

export function contributionDeliveryConfig() {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTRIBUTIONS_FROM_EMAIL?.trim();
  const to = process.env.CONTRIBUTIONS_TO_EMAIL?.trim() || schoolContactEmail;
  return key && from && to ? { key, from, to } : null;
}
export async function contributionAttachments(form: FormData, value: Contribution) {
  const files = form.getAll("photos").filter(item => typeof item !== "string" && item.size > 0) as File[];
  if (form.getAll("photos").some(item => typeof item === "string")) throw new ContributionError("Please attach photograph files only.");
  if (files.length > maxPhotoCount) throw new ContributionError("Please choose up to three photographs.");
  if (files.length && !value.photoRights) throw new ContributionError("Please confirm you have permission to share these photographs.");
  const attachments: { filename: string; content: string }[] = [];
  for (const [index, file] of files.entries()) {
    if (!photoTypes.includes(file.type) || file.size > maxPhotoBytes) throw new ContributionError("Please use JPEG, PNG, or WebP photographs of up to 1 MB each.");
    try {
      const input = Buffer.from(await file.arrayBuffer());
      const image = sharp(input, { limitInputPixels: 40_000_000, failOn: "warning" });
      const metadata = await image.metadata();
      if (!["jpeg", "png", "webp"].includes(metadata.format || "") || (metadata.pages || 1) > 1) throw new Error();
      // Always decode and re-encode; never deliver original names or GPS/EXIF.
      const photo = await image.rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#fff" }).jpeg({ quality: 80 }).toBuffer();
      if (photo.length > maxPhotoBytes) throw new Error();
      attachments.push({ filename: `tree-observation-${index + 1}.jpg`, content: photo.toString("base64") });
    } catch { throw new ContributionError("A photograph could not be read. Please choose a still JPEG, PNG, or WebP image."); }
  }
  return attachments;
}
export async function deliverContribution(value: Contribution, attachments: { filename: string; content: string }[], tokenId: string, config: NonNullable<ReturnType<typeof contributionDeliveryConfig>>, send = fetch) {
  const payload = { from: config.from, to: [config.to], reply_to: value.email, subject: `Tree Yoga School: ${value.topic}${value.reference ? " — " + value.reference.slice(0, 100).replace(/[\r\n]/g, " ") : ""}`,
    text: contributionText(value, attachments.map(item => item.filename)), ...(attachments.length ? { attachments } : {}) };
  // The same form + content has the same provider key, including after an
  // ambiguous timeout. An edited message becomes a distinct contribution.
  const body = JSON.stringify(payload);
  const idempotencyKey = `tree-yoga/${tokenId}/${createHash("sha256").update(body).digest("hex")}`;
  let response: Response;
  try { response = await send("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${config.key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body, signal: AbortSignal.timeout(15000) }); }
  catch { throw new ContributionError("We could not confirm delivery. Please try again; your entries are still here.", 502); }
  if (!response.ok) throw new ContributionError("Your contribution could not be sent right now. Please try again or use email.", response.status === 429 ? 429 : 502);
  const result = await response.json().catch(() => null);
  if (typeof result?.id !== "string" || !result.id) throw new ContributionError("We could not confirm delivery. Please try again.", 502);
}
