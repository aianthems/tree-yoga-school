import Link from "next/link";
import Image from "next/image";
import { flagshipLessons, type FlagshipSlug } from "../../lib/flagship-lessons";
import { bookChapters, bookChapterVideos } from "../../lib/book-chapters";
import { getTree } from "../../lib/trees";
import { treeVisits } from "../../lib/tree-visits";
import OptionalOriginalVideo from "./optional-original-video";

export function LessonNavigation({ slug }: { slug: FlagshipSlug }) {
  const lesson = flagshipLessons[slug];
  return <nav className="flagship-navigation" aria-label="This lesson"><a href={`#${lesson.prepareId}`}>Prepare</a><a href={`#${lesson.readId}`}>Read</a><a href="#original-teaching">Watch</a><Link href={`/practice/${slug}`}>Practice outside</Link><a href={`#${lesson.reflectionId}`}>Reflect</a></nav>;
}

export function LessonVisual({ slug }: { slug: FlagshipSlug }) {
  const lesson = flagshipLessons[slug];
  if (lesson.visual === "positions") return <figure className="lesson-instruction-visual">
    <svg viewBox="0 0 640 280" role="img" aria-label="Two starting-position illustrations: a seated person with feet supported and a standing person with feet on the ground. Arms rest at the sides." className="lesson-position-illustration">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M65 235h205M365 235h205" opacity=".3" />
        <path d="M110 115v65h100M115 180v55M200 180v55" strokeWidth="5" />
        <circle cx="150" cy="64" r="21" /><path d="M150 90v90h62v50h29M150 108l-18 47h30" />
        <circle cx="460" cy="52" r="21" /><path d="M460 79v83m0-62-33 55m33-55 33 55m-33 7-21 68h-23m44-68 21 68h23" />
      </g>
      <text x="145" y="270" textAnchor="middle" fill="currentColor" fontSize="21">Seated</text><text x="460" y="270" textAnchor="middle" fill="currentColor" fontSize="21">Standing</text>
    </svg><figcaption><strong>Choose your starting position.</strong> {lesson.visualPrompt} Illustration for this adapted lesson; it does not demonstrate the arm movement sequence.</figcaption>
  </figure>;
  const pine = getTree("pine")!;
  const detail = pine.detailImages.find(image => image.image.endsWith(lesson.visual === "bark" ? "pine-bark.webp" : "pine-needles.webp"))!;
  const trail = treeVisits.find(visit => visit.slug === "gifford-old-growth")!.destinationPhotos![0];
  const image = lesson.visual === "trail" ? {src:trail.image,alt:trail.alt,width:trail.width,height:trail.height,credit:trail.photographer,source:trail.sourceUrl,license:trail.license,licenseUrl:trail.licenseUrl} : {src:detail.image,alt:detail.imageAlt,width:detail.imageWidth,height:detail.imageHeight,credit:detail.credit.photographer,source:detail.credit.sourceUrl,license:detail.credit.license,licenseUrl:detail.credit.licenseUrl};
  return <figure className={`lesson-instruction-visual lesson-visual-${lesson.visual}`}>
    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 760px) 90vw, 760px" />
    <figcaption><strong>An observation prompt.</strong> {lesson.visualPrompt} {lesson.visual === "trail" ? "The photograph shows Gifford Woods, not a required destination or a confirmation of current trail conditions." : "You can practice with any tree; identifying this species is not required."}<span className="lesson-photo-credit">Photo: {image.credit} · <a href={image.source} target="_blank" rel="noreferrer">Source</a> · <a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.license}</a></span></figcaption>
  </figure>;
}

export function LessonOriginalTeaching({ slug }: { slug: FlagshipSlug }) {
  const lesson = flagshipLessons[slug];
  const chapter = bookChapters.find(chapter => chapter.slug === lesson.videoChapter)!;
  const video = bookChapterVideos[lesson.videoChapter][0];
  return <section className="lesson-section" aria-labelledby="original-teaching">
    <p className="section-kicker">Optional · Original teaching with Alex Julian</p><h2 id="original-teaching">Watch the original chapter lesson.</h2>
    <p><strong>{chapter.title} · {lesson.videoDuration}.</strong> This longer chapter video accompanies the original book. It provides wider context; it is not a step-by-step demonstration of the shorter adapted practice on this page.</p>
    <OptionalOriginalVideo {...video} />
    <p className="lesson-note">Captions were unavailable in the source player when reviewed on October 17, 2026. A verified transcript is not yet available here. The <a className="course-link" href={`#${lesson.readId}`}>Read section</a> gives complete written instructions for this adapted practice; it is not a transcript of Alex’s video.</p>
    <Link className="course-link" href={`/book/${lesson.videoChapter}`}>Explore the original chapter companion</Link>
  </section>;
}

export function LessonProvenance({ slug }: { slug: FlagshipSlug }) {
  const lesson = flagshipLessons[slug];
  return <dl className="lesson-provenance"><div><dt>Original teaching</dt><dd>{lesson.original}</dd></div><div><dt>New adaptation</dt><dd>{lesson.adaptation}</dd></div></dl>;
}
