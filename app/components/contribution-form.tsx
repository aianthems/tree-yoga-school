"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { contactDraft, contactTopics, schoolContactEmail } from "../../lib/school-contact";
import { maxPhotoBytes, maxPhotoCount, photoTypes } from "../../lib/contributions";

async function preparePhoto(file: File, index: number) {
  if (!photoTypes.includes(file.type) || file.size > 20 * 1024 * 1024) throw new Error("Choose JPEG, PNG, or WebP photographs of up to 20 MB each.");
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error("Please choose a smaller photograph (up to 40 megapixels).");
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the photographs. Please send them by email instead.");
    context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("A photograph could not be prepared.")), "image/jpeg", .8));
    if (blob.size > maxPhotoBytes) throw new Error("A photograph is still too large. Choose a smaller image.");
    return new File([blob], `tree-observation-${index + 1}.jpg`, { type: "image/jpeg" });
  } finally { bitmap.close(); }
}
export default function ContributionForm({ initial, configured }: { initial: { topic: string; reference: string; state: string }; configured: boolean }) {
  const [topic, setTopic] = useState(initial.topic);
  const [token, setToken] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [preparing, setPreparing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [publication, setPublication] = useState({ text: false, photos: false });
  const [notice, setNotice] = useState("");
  const [draftHref, setDraftHref] = useState(`mailto:${schoolContactEmail}`);
  const photoGeneration = useRef(0);
  async function refreshToken() {
    try {
      const response = await fetch("/api/contributions", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.token) throw new Error(result.error || "The form could not connect. Please try again.");
      setToken(result.token); setNotice("");
    } catch (error) { setNotice(error instanceof Error ? error.message : "The form could not connect. Please use email."); }
  }
  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    fetch("/api/contributions", { cache: "no-store" }).then(async response => {
      const result = await response.json();
      if (cancelled) return;
      if (response.ok && result.token) setToken(result.token);
      else setNotice(result.error || "The form could not connect. Please try again.");
    }).catch(() => { if (!cancelled) setNotice("The form could not connect. Please try again or use email."); });
    return () => { cancelled = true; };
  }, [configured]);
  async function choosePhotos(files: FileList | null) {
    const generation = ++photoGeneration.current;
    setPhotos([]); setNotice("");
    if (!files?.length) { setPreparing(false); return; }
    if (files.length > maxPhotoCount) { setPreparing(false); setNotice("Please choose up to three photographs."); return; }
    setPreparing(true);
    try {
      const prepared: File[] = [];
      for (const [index, file] of Array.from(files).entries()) prepared.push(await preparePhoto(file, index));
      if (generation === photoGeneration.current) setPhotos(prepared);
    } catch (error) { if (generation === photoGeneration.current) setNotice(error instanceof Error ? error.message : "A photograph could not be read. Please use JPEG, PNG, or WebP."); }
    finally { if (generation === photoGeneration.current) setPreparing(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || preparing || !token || !configured) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const originals = data.getAll("photos").filter(item => item instanceof File && item.size);
    if (originals.length && photos.length !== originals.length) { setNotice("Please correct the photograph selection, or remove the photographs before sending."); return; }
    data.delete("photos"); photos.forEach(photo => data.append("photos", photo)); data.set("token", token);
    setSending(true); setNotice("");
    try {
      const response = await fetch("/api/contributions", { method: "POST", body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.accepted) throw new Error(result?.error || "Your contribution could not be sent. Please try again or use email.");
      setSent(true); setPhotos([]); setPublication({ text: false, photos: false }); form.reset();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Your contribution could not be sent. Your entries are still here."); }
    finally { setSending(false); }
  }
  if (sent) return <section className="contribution-success" role="status"><h2>Thank you for helping the school grow.</h2><p>Your contribution has been sent for review. It has not been published or added to the map.</p><button className="button secondary" type="button" onClick={() => { setSent(false); setToken(""); void refreshToken(); }}>Send another contribution</button></section>;
  return <section className="contribution-form" aria-labelledby="contribution-title">
    <h2 id="contribution-title">Share something useful.</h2>
    <p>A correction, a dated observation, or an offer to help. Your contribution goes to Alex for review.</p>
    {!configured && <p className="contribution-notice" role="status">Online sending is being connected. You can prepare an email draft below and attach photographs in your email app.</p>}
    {initial.reference && <p className="contribution-context">Champion Map record: <strong>{initial.reference}</strong>{initial.state && <> · {initial.state}</>}. Please describe the correction and include a supporting source.</p>}
    <form onSubmit={submit} onChange={event => {
      const data = new FormData(event.currentTarget);
      const permissions = `\n\nName: ${data.get("name") || "Not supplied"}\nEmail: ${data.get("email") || "Not supplied"}\nState: ${data.get("state") || "Not supplied"}\nGeneral place: ${data.get("place") || "Not supplied"}\nPhotograph sharing rights confirmed: ${data.get("photoRights") === "on" ? "Yes" : "No photographs / not confirmed"}\nObservation date: ${data.get("observed") || "Not supplied"}\nSource: ${data.get("source") || "Not supplied"}\nPublication permission for message: ${data.get("publishText") === "on" ? "Yes" : "No"}\nPublication permission for photos: ${data.get("publishPhotos") === "on" ? "Yes" : "No"}\nCredit: ${data.get("credit") || "Not supplied"}`;
      setDraftHref(contactDraft(String(data.get("topic")), String(data.get("reference") || ""), String(data.get("message") || "") + permissions).href);
    }}>
      <fieldset disabled={sending}>
        <legend className="sr-only">Your contribution</legend>
        <div className="contribution-grid">
          <label>What is it about?<select name="topic" value={topic} onChange={event => setTopic(event.target.value)}>{contactTopics.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label>Your name<input name="name" autoComplete="name" required maxLength={100} /></label>
          <label>Your email<input name="email" type="email" autoComplete="email" required maxLength={254} /><span>For replies about this contribution.</span></label>
          <label>Page link or Champion Map record ID{topic === "correction" ? "" : " (optional)"}<input name="reference" defaultValue={initial.reference} required={topic === "correction"} maxLength={500} placeholder="Page link or record ID" /></label>
          <label>State abbreviation (optional)<input name="state" defaultValue={initial.state} maxLength={2} pattern="[A-Za-z]{2}" placeholder="MA" /></label>
          <label>General place (optional)<input name="place" maxLength={200} placeholder="Park, town, or county" /></label>
          <label>Observation date{topic === "observation" ? "" : " (optional)"}<input name="observed" type="date" required={topic === "observation"} /></label>
          <label>Supporting source link (optional)<input name="source" type="url" maxLength={1000} placeholder="https://…" /></label>
        </div>
        <label className="contribution-message">Your message<textarea name="message" rows={6} required minLength={10} maxLength={5000} placeholder={topic === "volunteer" ? "Where would you like to help? Tell us about your interests and local knowledge." : "What did you notice? Separate what you observed from what you inferred."} /></label>
        <div className="contribution-photos"><label>Photographs (optional)<input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple aria-describedby="photo-help" onChange={event => void choosePhotos(event.target.files)} /></label><p id="photo-help">Up to three still JPEG, PNG, or WebP photographs, 20 MB each. We prepare smaller copies and remove embedded location metadata. Keep your originals.</p><p role="status">{preparing ? "Preparing photographs…" : photos.length ? `${photos.length} photograph${photos.length === 1 ? "" : "s"} ready to send.` : ""}</p><label className="contribution-check"><input name="photoRights" type="checkbox" required={photos.length > 0} />I took these photographs or have permission to share them for review.</label></div>
        <fieldset className="contribution-permission"><legend>Publication permission · optional</legend><p>Your contribution stays private for review unless you choose otherwise. Permission does not guarantee publication.</p><label className="contribution-check"><input name="publishText" type="checkbox" checked={publication.text} onChange={event => setPublication(value => ({ ...value, text: event.target.checked }))} />Tree Yoga School may publish my message or excerpts.</label><label className="contribution-check"><input name="publishPhotos" type="checkbox" checked={publication.photos} onChange={event => setPublication(value => ({ ...value, photos: event.target.checked }))} />Tree Yoga School may publish my submitted photographs.</label><label>Preferred credit (required if giving publication permission)<input name="credit" required={publication.text || publication.photos} maxLength={100} placeholder="Your chosen name, or Anonymous" /></label></fieldset>
        <div className="contribution-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="contribution-check"><input name="contactConsent" type="checkbox" required />I agree to send these details and photographs to Tree Yoga School for review and related replies. <Link href="/contact#privacy">How we handle contributions</Link>.</label>
        <p className="lesson-note">Keep private addresses, owner contact details, and undisclosed tree locations out of your contribution. Use permitted viewpoints; a map marker does not establish visiting permission.</p>
        <div className="course-actions"><button className="button primary" type="submit" disabled={!configured || !token || preparing || sending}>{sending ? "Sending…" : "Send contribution →"}</button>{configured && !token && <button className="button secondary" type="button" onClick={() => void refreshToken()}>Reconnect form</button>}</div>
      </fieldset>
      {notice && <div className="contribution-notice" role="alert"><p>{notice}</p>{configured && (!token || /expired|refresh the form/i.test(notice)) && <button className="course-link" type="button" onClick={() => void refreshToken()}>Refresh the form connection</button>}</div>}
    </form>
    <noscript><p>Online sending needs JavaScript. You can contact the school by email instead.</p></noscript>
    <p>Prefer email? <a className="course-link" href={draftHref}>Open an email draft →</a> You can attach photographs there. Nothing is sent until you send the email.</p>
  </section>;
}
