export default function TreeEmbrace({ compact = false }: { compact?: boolean }) {
  return <svg className={`hug-art${compact ? " hug-art-compact" : ""}`} viewBox="0 0 620 720" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" opacity=".2" strokeWidth="1">
      {[110, 150, 194, 239, 288, 339].map(r => <ellipse key={r} cx="325" cy="355" rx={r * .86} ry={r} transform={`rotate(-12 325 355)`} />)}
    </g>
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M248 680C281 569 275 473 277 366C279 272 258 182 229 102M381 680C350 581 358 464 346 363C335 274 360 182 385 95" fill="#233e32" />
      <path d="M297 643C318 524 305 436 305 342C305 264 292 197 281 142M321 614C339 508 326 456 325 388M273 321C229 290 185 240 154 180M348 274C411 235 451 194 474 133M266 207C226 168 183 146 123 139M359 210C410 178 430 147 434 101M299 303C322 245 331 168 315 76" />
      <path d="M149 177C120 158 93 176 97 204C124 213 150 198 149 177ZM182 230C154 208 126 225 130 251C158 261 181 251 182 230ZM426 174C446 148 477 154 483 179C462 199 434 197 426 174ZM466 137C478 106 507 102 522 125C509 151 481 158 466 137ZM310 115C287 88 304 60 332 63C347 86 336 112 310 115Z" fill="currentColor" opacity=".65" stroke="none" />
    </g>
    <g fill="#eec480" stroke="#eec480" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M185 365C158 362 145 342 150 321C155 299 176 286 197 295C218 304 223 322 214 338L203 352L202 377" />
      <path d="M188 369C151 379 137 418 145 455L164 500L140 643L179 643L204 526L215 643L255 643L234 491C225 454 222 415 225 396L213 375" />
      <path d="M208 387C232 407 258 415 291 407L346 388C359 383 365 392 352 400L299 429C252 444 222 436 195 417" />
      <path d="M158 395C179 378 197 368 226 366L267 367C279 367 283 376 269 378L230 383L194 404" />
    </g>
    <g stroke="#233e32" strokeWidth="2" strokeLinecap="round"><path d="M204 320L211 322M193 337C199 340 204 337 207 334M172 386C169 402 177 412 191 418M188 498C203 500 216 497 224 491M281 417L311 407" /></g>
    <path d="M85 677C161 664 203 683 246 678C312 670 367 690 439 678C468 674 504 677 544 681" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="461" cy="315" r="4" fill="currentColor" /><circle cx="117" cy="463" r="3" fill="currentColor" />
  </svg>;
}
