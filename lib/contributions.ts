import { contactTopics } from "./school-contact";

export const maxPhotoCount = 3;
export const maxPhotoBytes = 1024 * 1024;
export const maxSubmissionBytes = 3 * maxPhotoBytes + 64 * 1024;
export const photoTypes = ["image/jpeg", "image/png", "image/webp"];
export type Contribution = {
  topic: string; name: string; email: string; reference: string; state: string;
  place: string; observed: string; source: string; message: string; credit: string;
  publishText: boolean; publishPhotos: boolean; photoRights: boolean;
};
export class ContributionError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function contributionHref(record: { id: string; state: string }) {
  return `/big-tree-volunteers?${new URLSearchParams({ topic: "correction", record: record.id, state: record.state })}#contribute`;
}
export function contributionPrefill(params: Record<string, string | string[] | undefined>, defaultTopic = "hello") {
  const value = (key: string, limit: number) => typeof params[key] === "string" ? params[key].slice(0, limit) : "";
  const topic = value("topic", 20);
  const record = value("record", 200);
  return { topic: contactTopics.some(item => item.value === topic) ? topic : defaultTopic,
    reference: /^[a-z]{2}-[a-z0-9-]+$/i.test(record) ? record : "",
    state: /^[A-Z]{2}$/.test(value("state", 2)) ? value("state", 2) : "" };
}
export function validateContribution(form: FormData, today = new Date().toISOString().slice(0, 10)): Contribution {
  function field(key: string, max: number, required = false) {
    const raw = form.get(key);
    if (raw !== null && typeof raw !== "string") throw new ContributionError("Please check the text fields and try again.");
    const value = (raw || "").trim();
    if (value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new ContributionError(`Please shorten or correct the ${key} field.`);
    if (required && !value) throw new ContributionError(`Please include your ${key}.`);
    return value;
  }
  const topic = field("topic", 20, true);
  if (!contactTopics.some(item => item.value === topic)) throw new ContributionError("Please choose a contribution type.");
  const name = field("name", 100, true), email = field("email", 254, true);
  if (/[\r\n]/.test(name) || !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(email)) throw new ContributionError("Please enter a valid name and email address.");
  const reference = field("reference", 500, topic === "correction");
  const observed = field("observed", 10, topic === "observation");
  if (observed && (!/^\d{4}-\d{2}-\d{2}$/.test(observed) || Number.isNaN(Date.parse(observed)) || new Date(observed).toISOString().slice(0, 10) !== observed || observed > today)) throw new ContributionError("Please enter a valid observation date, today or earlier.");
  const source = field("source", 1000);
  if (source) {
    try { const url = new URL(source); if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error(); }
    catch { throw new ContributionError("Please use a full http or https source link."); }
  }
  const state = field("state", 2).toUpperCase();
  if (state && !/^[A-Z]{2}$/.test(state)) throw new ContributionError("Please choose a state.");
  const message = field("message", 5000, true);
  if (message.length < 10) throw new ContributionError("Please add a little more detail to your message.");
  const checked = (key: string) => form.get(key) === "on";
  const publishText = checked("publishText"), publishPhotos = checked("publishPhotos"), credit = field("credit", 100);
  if ((publishText || publishPhotos) && !credit) throw new ContributionError("Please give a preferred publication credit, or write Anonymous.");
  if (form.get("contactConsent") !== "on") throw new ContributionError("Please agree to send your contribution for review.");
  return { topic, name, email, reference, state, place: field("place", 200), observed, source, message, credit, publishText, publishPhotos, photoRights: checked("photoRights") };
}
export function contributionText(value: Contribution, filenames: string[]) {
  return ["Tree Yoga School contribution — for review", `Type: ${contactTopics.find(item => item.value === value.topic)?.label}`,
    `Name: ${value.name}`, `Reply email: ${value.email}`, `Page / record: ${value.reference || "Not supplied"}`, `State: ${value.state || "Not supplied"}`,
    `General place: ${value.place || "Not supplied"}`, `Observation date: ${value.observed || "Not supplied"}`, `Supporting source: ${value.source || "Not supplied"}`,
    "", value.message, "", "PUBLICATION PERMISSION",
    `Message may be published: ${value.publishText ? "YES" : "NO — private review only"}`,
    `Photographs may be published: ${value.publishPhotos ? "YES" : "NO — private review only"}`,
    `Preferred credit: ${value.credit || "Not supplied"}`, `Photograph sharing rights confirmed: ${value.photoRights ? "YES" : "No photographs / not confirmed"}`,
    `Attachments: ${filenames.join(", ") || "None"}`, "", "This is a contributor report, not a verified update. Review evidence before changing records. No automatic publication."].join("\n");
}
