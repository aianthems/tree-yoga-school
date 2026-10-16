import Link from "next/link";
import SiteHeader from "../components/site-header";
import { pageMetadata } from "../../lib/site-seo";
import { schoolContactEmail } from "../../lib/school-contact";

export const metadata = pageMetadata("/privacy", "Privacy | Tree Yoga School", "How Tree Yoga School handles optional journey progress, email, contributions, and services that deliver videos, maps, and website content.");

export default function PrivacyPage() {
  return <><SiteHeader /><main id="content" className="lesson privacy-page">
    <section className="lesson-intro">
      <p className="section-kicker">Tree Yoga School · Privacy</p><h1>Privacy.</h1>
      <p className="lesson-lede">A little clarity about what stays on your device, what you choose to share, and the services that make this school available.</p>
      <p>Last updated: <time dateTime="2026-10-16">October 16, 2026</time>.</p>
      <p>Tree Yoga School is operated by Alex Julian. For privacy questions or requests, email <a className="course-link" href={`mailto:${schoolContactEmail}`}>{schoolContactEmail}</a>.</p>
    </section>
    <section className="lesson-section" aria-labelledby="journey-privacy">
      <h2 id="journey-privacy">Optional journey progress.</h2>
      <p>You can use the school without an account or saved progress. On the seven-day journey, progress is saved only after you choose “Remember my progress on this device.” It records which days you mark complete in your browser’s local storage. It does not save reflections, journal entries, your name, or your location.</p>
      <p>This progress is not sent to the school’s servers and is not used by the school for advertising. It stays in that browser until you remove it or the browser clears its data. It does not sync across devices or browsers, and private browsing or storage restrictions may prevent it from being kept.</p>
      <p>Use “Reset progress” to clear completed days while leaving remembering on. Use “Stop remembering and remove progress” to delete the saved progress and turn remembering off. You can also clear this website’s data through your browser settings. We cannot retrieve or delete device-only progress for you remotely.</p>
      <Link className="course-link" href="/begin-here/seven-days">Open the journey and progress controls</Link>
    </section>
    <section className="lesson-section" aria-labelledby="email-privacy">
      <h2 id="email-privacy">Email and contributions.</h2>
      <p>Contact and correction links open your email application. The website does not submit your message or upload photographs. If you choose to send an email, Alex receives the email address, message, attachments, and other information included in it. Email providers, including Gmail for the school’s inbox, process those messages.</p>
      <p>We use messages to answer questions, review corrections, and manage contributions or volunteer interest. Sending a message does not subscribe you to a mailing list or automatically publish your contribution. Tell us your publication permission and preferred credit when offering words or photographs. Contributions are reviewed before publication.</p>
      <p>Please avoid sending sensitive personal information, private addresses, or undisclosed tree locations. We keep correspondence as needed to handle the request and maintain relevant contribution and permission records. Email us to request access, correction, deletion, or withdrawal of permission for future use. Any applicable recordkeeping obligations may affect what can be deleted; copies already shared by others may be outside our control.</p>
    </section>
    <section className="lesson-section" aria-labelledby="services-privacy">
      <h2 id="services-privacy">Website delivery, videos, and maps.</h2>
      <p>Loading a webpage or external resource sends ordinary connection information to the service delivering it, such as your IP address, browser information, requested resource, and request time. Providers may process logs for delivery, security, and operation. Their processing and retention are described in their own privacy notices.</p>
      <ul>
        <li><strong>Hosting and media:</strong> Vercel hosts the website, and Cloudflare delivers some images and downloadable files. See the <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">Vercel Privacy Notice</a> and <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Cloudflare Privacy Policy</a>.</li>
        <li><strong>Videos:</strong> Embedded lessons use YouTube’s privacy-enhanced player at youtube-nocookie.com. Loading the player or playing a video still connects to Google/YouTube; privacy-enhanced mode does not mean no information is processed. Google’s policies govern its cookies, storage, and other processing. See <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google’s Privacy Policy</a> and <a href="https://support.google.com/youtube/answer/171780?hl=en" target="_blank" rel="noreferrer">YouTube’s explanation of privacy-enhanced embeds</a>.</li>
        <li><strong>Maps:</strong> The Champion Tree Map loads map tiles from OpenStreetMap. Tile requests reveal the map areas requested along with connection information. The school does not request your device’s precise location. See the <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noreferrer">OpenStreetMap Foundation Privacy Policy</a>. Published tree locations describe tree records, not a visitor’s position.</li>
      </ul>
      <p>Links to YouTube, Google Maps, official registers, photo sources, and other websites take you to services governed by their own policies. Browser privacy settings can limit cookies, storage, or external content, though some videos or maps may then work differently.</p>
    </section>
    <section className="lesson-section" aria-labelledby="choices-privacy">
      <h2 id="choices-privacy">Your choices and future updates.</h2>
      <p>Reflections can remain private, and the observation journal is a printable sheet rather than a website submission. You can leave progress remembering off, use the reset and removal controls, and choose whether to contact us or use external services.</p>
      <p>We will update this page and its date when the school’s practices change. Questions about this notice or information you have shared can be sent to <a className="course-link" href={`mailto:${schoolContactEmail}`}>{schoolContactEmail}</a>.</p>
      <Link className="course-link" href="/contact">Contact the school</Link>
    </section>
  </main></>;
}
