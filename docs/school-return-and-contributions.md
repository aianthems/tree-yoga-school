# Returning to the school and contributing

Five new static destinations: `/about`, `/contact`, `/big-tree-volunteers`,
`/return-to-your-tree`, and `/return-to-your-tree/journal`. Trees to Visit and the
return practice are primary links. The native keyboard-accessible School menu
holds About, Contact, Volunteers, Book, Practice, and Principles. General school
pages use the shared footer; quiet outdoor-practice pages retain their existing
footer. The introduction and visit directory link the return practice.

Big Tree Volunteers is an invitation to contribute observations and corrections,
not a claim that an organized network already operates. Reports include a page
or record ID, observation date, and supporting source. Location privacy, access,
photo permission/credit, and review before publication are explained.

Contact drafts are made in memory with controlled inputs, then encoded in a
`mailto:` URL for the visitor to review and send in their own email application.
There is no website submission, storage, subscription, or automatic map update.
The plain address is also available for messages and photo attachments. The
recipient is the single exported value in `lib/school-contact.ts`; the founder confirmed
`alexanderjulian33@gmail.com` as the temporary public address. The unavailable historical
school inbox is not used.

The return practice is a new adaptation inspired by the book's When and Where
chapter. Seasonal prompts are flexible, with stable-ground, seated, window,
no-touch, and permitted-viewpoint options. Four handwritten visits record dates,
weather, observations, change/continuity, reflection, and a future question.

The journal has a print stylesheet and a downloadable one-page Letter PDF usable
on A4 with fit-to-page. Rebuild the site asset using
`python scripts/create-observation-journal.py` (requires reportlab). A PNG render
was visually checked for margins, table rules, text, and writing space. The PDF
is a handwritten sheet, not a fillable form. No journal entries are collected.

All five destinations are registered in canonical/social metadata and sitemap.
