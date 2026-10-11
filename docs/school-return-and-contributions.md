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

Contact and Big Tree Volunteers display `alexjulianyoga@gmail.com` and native
email links. Map correction drafts include the record ID and state. Visitors
review and send messages and attachments in their own email application.
There is no website submission, storage, subscription, or automatic map update.
The recipient is defined once in `lib/school-contact.ts`. The direct submission
form and its delivery API are removed until the school is ready to introduce them.

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
