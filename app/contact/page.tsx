import Link from "next/link";
import { pageMetadata } from "../../lib/site-seo";
import { schoolContactEmail } from "../../lib/school-contact";
import SiteHeader from "../components/site-header";

export const metadata = pageMetadata("/contact", "Contact | Tree Yoga School", "Email Alex Julian with a question, correction, or tree observation.");

export default function ContactPage() {
  return <><SiteHeader /><main id="content" className="lesson community-page">
    <section id="contribute" className="lesson-intro">
      <p className="section-kicker">Contact the school · Alex Julian</p>
      <h1>A conversation begins here.</h1>
      <p className="lesson-lede">For questions, corrections, tree observations, or ideas for the school, please email:</p>
      <a className="course-link" href={`mailto:${schoolContactEmail}`}>{schoolContactEmail}</a>
    </section>
    <section className="lesson-section">
      <h2>Make a contribution useful.</h2>
      <p>For corrections, include the page link or Champion Map record ID, what appears incorrect, and the source that supports the change. For a visit observation, include the date and distinguish what you saw from what you inferred.</p>
      <p>If you offer words or photographs for publication, state your permission and preferred credit. Avoid sensitive personal information and undisclosed private locations.</p>
      <a className="course-link" href="/big-tree-volunteers">Learn about Big Tree Volunteers</a>
    </section>
    <section id="privacy" className="lesson-section">
      <h2>Contact by email.</h2>
      <p>Email links open your own email application, where you can review your message and add attachments before sending. The website does not collect messages or photographs.</p>
      <p>Messages are reviewed privately. Sending an email does not publish it, update the map, or subscribe you to a mailing list. To request deletion of a contribution or withdraw permission for future use, email the address above.</p>
      <Link className="course-link" href="/privacy">Read the Privacy page</Link>
    </section>
  </main></>;
}
