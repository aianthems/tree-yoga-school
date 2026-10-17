# Flagship beginner lesson polish — October 17, 2026

Scope: Your First Five Minutes, Meditation with a Tree, Gentle Yoga with a Tree,
and Tree Yoga Hiking. Original book text and video assets are unchanged.

Each lesson now has Prepare / Read / Watch / Practice outside / Reflect links,
a relevant visual with text explanation, an optional original chapter video,
and an explicit original-teaching / new-adaptation comparison. Existing source
links and lesson-to-outdoor-to-reflection routes remain available.

Observation imagery reuses the attributed Pine Library bark and needles images.
Hiking reuses the credited Gifford Woods trail photograph, explicitly identified
as an example rather than a required destination or current access guarantee.
The gentle-movement lesson uses a new inline SVG showing seated and standing
starting positions, not a movement demonstration or an advanced book pose.
Images have alt text, intrinsic dimensions and visible contextual captions.

Video placement is optional and labeled as original chapter context. The
18:39 When and Where video serves the first observation lesson. The 31:56 Who
and How video accompanies the other three. These durations were observed in
the source YouTube players on October 17, 2026. Both players displayed captions
as unavailable. No video transcript or timestamped spoken summary was available
or invented. The pages explicitly distinguish their written practice instructions
from a verbatim transcript. Producing and reviewing full source-video captions
and transcripts remains a separate accessibility task.

On these four pages, the external player is mounted only after the visitor
chooses to load it. No autoplay or artificial clips are introduced. The existing
chapter and homepage video components keep their previous behavior.

Shared configuration lives in lib/flagship-lessons.ts. Textual preparation,
practice steps and reflection still come from the existing lesson data. The
current 70% heading styles and cached subtle bark backgrounds are preserved.

Validation: 162 tests passed; production build passed. Regression checks cover
lesson/practice membership, anchor targets, original chapter/video mapping and
attributed local photographs. The starting-position SVG was rendered for
inspection. Live checks cover one lesson's anchor navigation, video opt-in,
source comparison and the existing outdoor return route after publication.
