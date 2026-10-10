"use client";
import { useState } from "react";
import { contactDraft, contactTopics, schoolContactEmail } from "../../lib/school-contact";
export default function ContactDraft() {
  const [topic, setTopic] = useState("hello");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const draft = contactDraft(topic, reference, message);
  return <section className="contact-draft" aria-labelledby="draft-title">
    <h2 id="draft-title">Make a message.</h2>
    <p>Write here, then open your email app to review and send. This page does not send or save your entries.</p>
    <div className="library-filter-field"><label htmlFor="contact-topic">What is it about?</label><select id="contact-topic" value={topic} onChange={event => setTopic(event.target.value)}>{contactTopics.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
    <div className="library-filter-field"><label htmlFor="contact-reference">Page link or Champion Map record ID (optional)</label><input id="contact-reference" type="text" value={reference} maxLength={500} onChange={event => setReference(event.target.value)} placeholder="Paste the page link or record ID" /></div>
    <div className="library-filter-field"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" rows={7} maxLength={3000} value={message} onChange={event => setMessage(event.target.value)} placeholder="What did you notice? Include the date and a source link if you have one." /></div>
    <p className="lesson-note">For an observation, include the visit date, species if known, general place, visible changes, and whether access information has changed. Keep private addresses and exact locations out of the message unless the owner has agreed to share them.</p>
    {draft.href ? <a className="button primary" href={draft.href}>Open email draft →</a> : <p>The contact inbox is being connected.</p>}
    <p>Prefer your own email app? {schoolContactEmail ? <a className="course-link" href={`mailto:${schoolContactEmail}`}>{schoolContactEmail}</a> : "The public address will appear here."} You can attach your own photographs there and say whether we may publish them, with your preferred credit.</p>
  </section>;
}
