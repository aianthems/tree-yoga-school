"use client";

import ResponsiveImage from "./responsive-image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteNavigation } from "../../lib/site-navigation";

export default function SiteHeader() {
  const pathname = usePathname();
  const activeGroup = siteNavigation.flatMap(group => group.links.map(link => ({ group: group.id, href: link.href })))
    .filter(link => pathname === link.href || pathname.startsWith(link.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.group;
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const groupButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const close = () => { setOpenGroup(null); setMobileOpen(false); };

  useEffect(() => {
    if (!openGroup && !mobileOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) { setOpenGroup(null); setMobileOpen(false); }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openGroup) { groupButtons.current[openGroup]?.focus(); setOpenGroup(null); }
      else { menuButton.current?.focus(); setMobileOpen(false); }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [openGroup, mobileOpen]);

  return <><a className="skip-link" href="#content">Skip to content</a>
    <header className="site-header" ref={header} onPointerLeave={event => {
      if (event.pointerType === "mouse" && window.matchMedia("(min-width: 901px) and (hover: hover)").matches) setOpenGroup(null);
    }}>
      <Link className="brand school-brand" href="/" aria-label="Tree Yoga School home" onClick={close}><ResponsiveImage image="logo" alt="" width={58} height={58} sizes="(max-width: 900px) 48px, 58px" priority /><span className="school-brand-copy"><span>Tree Yoga School</span><small>Practice with the living world</small></span></Link>
      <button className="site-menu-toggle" ref={menuButton} type="button" aria-expanded={mobileOpen} aria-controls="school-primary-nav" onClick={() => { setMobileOpen(!mobileOpen); setOpenGroup(null); }}><span>{mobileOpen ? "Close" : "Menu"}</span><span className="site-menu-symbol" aria-hidden="true">{mobileOpen ? "×" : "☰"}</span></button>
      <nav className="school-primary-nav" id="school-primary-nav" aria-label="Primary navigation" data-mobile-open={mobileOpen}>
        {siteNavigation.map(group => {
          const active = activeGroup === group.id;
          const expanded = openGroup === group.id;
          return <div className="site-nav-group" key={group.id} data-active={active} onPointerEnter={event => {
            if (event.pointerType === "mouse" && window.matchMedia("(min-width: 901px) and (hover: hover)").matches) setOpenGroup(group.id);
          }}>
            <button type="button" className="site-nav-trigger" ref={element => { groupButtons.current[group.id] = element; }} aria-expanded={expanded} aria-controls={`site-nav-${group.id}`} onClick={() => setOpenGroup(expanded ? null : group.id)}>{group.title}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button>
            <div className="site-nav-panel" id={`site-nav-${group.id}`} hidden={!expanded}>
              <div className="site-nav-intro"><p className="section-kicker">{group.title}</p><p className="site-nav-invitation">{group.invitation}</p><p>{group.description}</p></div>
              <ul className="site-nav-links">{group.links.map(link => <li key={link.href}><Link href={link.href} onClick={close} aria-current={pathname === link.href ? "page" : undefined}><span>{link.label}<i aria-hidden="true">↗</i></span><small>{link.description}</small></Link></li>)}</ul>
            </div>
          </div>;
        })}
        <Link className="site-nav-begin" href="/begin-here" onClick={close} aria-current={pathname === "/begin-here" ? "page" : undefined}>Begin Here <span aria-hidden="true">↗</span></Link>
      </nav>
    </header></>;
}
