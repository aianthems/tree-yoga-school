import { createHash } from "node:crypto";
import { ContributionError, validateContribution } from "../../../lib/contributions";
import { allowContributionAttempt, createContributionToken, readContributionForm, verifyContributionToken } from "../../../lib/contribution-security";
import { contributionAttachments, contributionDeliveryConfig, deliverContribution } from "../../../lib/contribution-delivery";
import { siteOrigin } from "../../../lib/site-seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const identity = (request: Request) => createHash("sha256").update(`${request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"}|${request.headers.get("user-agent") || ""}`).digest("hex");
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([siteOrigin, "https://www.treeyogaschool.com"]);
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) allowed.add(`https://${process.env.VERCEL_BRANCH_URL}`);
  if (process.env.NODE_ENV !== "production") allowed.add(new URL(request.url).origin);
  return !!origin && allowed.has(origin);
}
export async function GET(request: Request) {
  const config = contributionDeliveryConfig();
  if (!config) return reply({ error: "Online sending is being connected. You can use email meanwhile." }, 503);
  if (request.headers.get("sec-fetch-site") === "cross-site") return reply({ error: "Please open the form on Tree Yoga School." }, 403);
  return reply({ token: createContributionToken(config.key, identity(request)) });
}
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return reply({ error: "Please submit through the Tree Yoga School form." }, 403);
    const config = contributionDeliveryConfig();
    if (!config) return reply({ error: "Online sending is being connected. Please use email meanwhile." }, 503);
    const form = await readContributionForm(request);
    if (form.get("website")) throw new ContributionError("Your contribution could not be accepted.");
    const token = form.get("token");
    const tokenId = verifyContributionToken(typeof token === "string" ? token : "", config.key, identity(request));
    const value = validateContribution(form);
    if (!allowContributionAttempt(identity(request))) return reply({ error: "Please wait ten minutes before trying again, or contact us by email." }, 429);
    const attachments = await contributionAttachments(form, value);
    await deliverContribution(value, attachments, tokenId, config);
    return reply({ accepted: true });
  } catch (error) {
    if (error instanceof ContributionError) return reply({ error: error.message }, error.status);
    // Do not log visitor fields, attachment data, provider responses, or secrets.
    return reply({ error: "Your contribution could not be sent. Please try again or use email." }, 500);
  }
}
