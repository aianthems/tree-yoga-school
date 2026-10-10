import Link from "next/link";
import { championStates, type ChampionState } from "../../lib/champion-states";
import { championHref } from "../../lib/champion-links";

const featuredStates: ChampionState[] = ["MA", "NH", "CO", "LA", "OK", "TX"];
const availableStates = Object.entries(championStates).sort((a, b) => a[1].name.localeCompare(b[1].name));
const listedCount = availableStates.reduce((total, [, state]) => total + state.expectedRecords, 0);

export default function HomeChampions() {
  return (
    <section className="home-champions" id="meet-the-giants" aria-labelledby="home-champions-title">
      <div className="home-champions-main">
        <div className="home-champions-copy">
          <p className="section-kicker">Out in the world · The Champion Tree Map</p>
          <h2 id="home-champions-title">Meet the<br /><em>giants.</em></h2>
          <p className="home-champions-lede">A wider world of wonder. A closer relationship with trees.</p>
          <p>Discover remarkable trees across the country. Explore their measurements, the places they grow, and the stories their state registers share.</p>
          <div className="home-champions-stats">
            <span><strong>{listedCount.toLocaleString("en-US")}</strong> listed tree records</span>
            <span><strong>{availableStates.length}</strong> states to explore</span>
          </div>
          <Link className="button home-champions-button" href="/champion-trees#explorer" prefetch={false}>Explore the Champion Map →</Link>
          <p className="home-champions-note">Markers show approximate areas. Check the original record and visiting guidance before heading out.</p>
        </div>
        <div className="home-champions-art" aria-hidden="true">
          <svg viewBox="0 0 560 610" fill="none" focusable="false">
            <circle cx="300" cy="260" r="230" stroke="currentColor" opacity=".18" />
            <circle cx="300" cy="260" r="184" stroke="currentColor" opacity=".12" />
            <path d="M70 548H525M300 25V552" stroke="currentColor" opacity=".3" strokeDasharray="3 9" />
            <path d="M257 536C277 480 280 431 278 359L260 295 212 257 185 192 216 219 244 235 234 177 259 213 280 261 289 176 272 125 289 150 303 207 325 154 340 97 340 156 316 233 312 289 356 260 386 210 367 267 321 313 315 413C315 474 333 514 358 537L309 525 294 551 279 525Z" fill="#b8caa3" />
            <path d="M276 512C293 440 295 376 294 302M294 303L261 251M295 283L310 226" stroke="#173329" strokeWidth="2" opacity=".65" />
            <g fill="#7e9b76">
              <ellipse cx="284" cy="116" rx="99" ry="72" />
              <ellipse cx="195" cy="166" rx="102" ry="71" />
              <ellipse cx="386" cy="161" rx="103" ry="77" />
              <ellipse cx="156" cy="230" rx="100" ry="64" />
              <ellipse cx="428" cy="236" rx="98" ry="66" />
              <ellipse cx="286" cy="181" rx="100" ry="79" />
            </g>
            <g fill="#a9bd92" opacity=".75">
              <ellipse cx="228" cy="117" rx="49" ry="34" />
              <ellipse cx="366" cy="127" rx="62" ry="33" />
              <ellipse cx="130" cy="212" rx="46" ry="26" />
              <ellipse cx="434" cy="214" rx="49" ry="29" />
            </g>
            <path d="M270 243L280 264 287 228M310 253L323 225" stroke="#b8caa3" strokeWidth="7" strokeLinecap="round" />
            <g stroke="#edc580" strokeWidth="3" strokeLinecap="round">
              <circle cx="172" cy="516" r="5" fill="#edc580" stroke="none" />
              <path d="M172 525V538M172 529L165 533M172 529L179 531M172 538L166 548M172 538L178 548" />
            </g>
            <path d="M234 554C263 546 304 542 365 554M86 565C193 584 387 586 505 565" stroke="currentColor" opacity=".3" />
          </svg>
          <p>Let curiosity<br /><em>take root.</em></p>
        </div>
      </div>
      <div className="home-champions-states">
        <p className="section-kicker">Choose a place to begin</p>
        <nav className="home-champions-shortcuts" aria-label="Featured states on the Champion Map">
          {featuredStates.map(state => (
            <Link key={state} href={`${championHref({ state })}#explorer`} prefetch={false}>
              <span>{championStates[state].name}</span><span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <details className="home-champions-directory">
          <summary>Find your state · All {availableStates.length} available states</summary>
          <nav aria-label="All states on the Champion Map">
            {availableStates.map(([state, config]) => (
              <Link key={state} href={`${championHref({ state })}#explorer`} prefetch={false}>{config.name}<span>{config.expectedRecords.toLocaleString("en-US")} records</span></Link>
            ))}
          </nav>
        </details>
      </div>
    </section>
  );
}
