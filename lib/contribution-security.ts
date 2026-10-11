import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { ContributionError, maxSubmissionBytes } from "./contributions";

const tokenLifetime = 60 * 60 * 1000;
const signature = (secret: string, value: string) => createHmac("sha256", secret).update(`tree-yoga-contribution:${value}`).digest("hex");
export function createContributionToken(secret: string, identity: string, now = Date.now()) {
  const value = `${now}.${randomUUID()}.${signature(secret, identity)}`;
  return `${value}.${signature(secret, value)}`;
}
export function verifyContributionToken(token: string, secret: string, identity: string, now = Date.now()) {
  const parts = token.split(".");
  if (parts.length !== 4 || !/^\d{13}$/.test(parts[0]) || !/^[0-9a-f-]{36}$/.test(parts[1]) || !parts.slice(2).every(part => /^[0-9a-f]{64}$/.test(part))) throw new ContributionError("Please refresh the form and try again.");
  const value = parts.slice(0, 3).join(".");
  if (!timingSafeEqual(Buffer.from(parts[3], "hex"), Buffer.from(signature(secret, value), "hex")) || parts[2] !== signature(secret, identity)) throw new ContributionError("Please refresh the form and try again.");
  const elapsed = now - Number(parts[0]);
  if (elapsed < 3000) throw new ContributionError("Please take a moment to check your message, then send it again.", 429);
  if (elapsed > tokenLifetime) throw new ContributionError("Your form has expired. Refresh the form before sending.");
  return parts[1];
}
// A local safety net, not a distributed quota. Platform-level limits can be
// added in Vercel as traffic grows. Store only short-lived keyed hashes.
const attempts = new Map<string, { count: number; until: number }>();
export function allowContributionAttempt(identity: string, now = Date.now()) {
  for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
  const value = attempts.get(identity);
  if (value && value.count >= 5) return false;
  if (value) value.count++;
  else { if (attempts.size >= 5000) return false; attempts.set(identity, { count: 1, until: now + 10 * 60 * 1000 }); }
  return true;
}
export async function readContributionForm(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new ContributionError("Please submit the contribution form.", 415);
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxSubmissionBytes)) throw new ContributionError("Please reduce the photographs and try again.", 413);
  if (!request.body) throw new ContributionError("Your message is empty.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const next = await reader.read(); if (next.done) break;
      size += next.value.byteLength;
      if (size > maxSubmissionBytes) { await reader.cancel(); throw new ContributionError("Please reduce the photographs and try again.", 413); }
      chunks.push(next.value);
    }
    const body = Buffer.concat(chunks);
    return await new Response(body, { headers: { "content-type": request.headers.get("content-type")! } }).formData();
  } catch (error) {
    if (error instanceof ContributionError) throw error;
    throw new ContributionError("The upload could not be read. Please try again.");
  } finally { reader.releaseLock(); }
}
