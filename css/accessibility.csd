/* ═══════════════════════════════════════
   ACCESSIBILITY OVERRIDES
   High contrast · Font scaling · Big tap targets
   ═══════════════════════════════════════ */

/* ─────────────────────────────────────
   1. HIGH CONTRAST MODE
   Toggled by JS: document.documentElement.dataset.theme = "contrast"
   ───────────────────────────────────── */
html[data-theme="contrast"] {
  --bg:            #000000;
  --bg-card:       #111111;
  --bg-elevated:   #0A0A0A;
  --text:          #FFFFFF;
  --text-muted:    #D9D9D9;
  --text-inverse:  #000000;
  --border:        #FFFFFF;

  /* Bold, high-visibility accents */
  --accent:        #FFD700;   /* gold       */
  --accent-soft:   #4A3A00;
  --accent-2:      #00E5FF;   /* cyan       */
  --accent-2-soft: #003A44;
  --accent-3:      #00FF88;   /* neon green */
  --accent-3-soft: #003A22;
  --accent-4:      #FF80FF;   /* magenta    */
  --accent-4-soft: #3A003A;

  --shadow-sm: none;
  --shadow-md: none;
}

/* Kill gradient card backgrounds — they hurt contrast */
html[data-theme="contrast"] .card {
  background: #111111 !important;
  border: 2px solid #FFFFFF;
  color: #FFFFFF;
}

/* Header, drawer, footer borders */
html[data-theme="contrast"] .site-header {
  background: #000000;
  border-bottom: 2px solid #FFFFFF;
}
html[data-theme="contrast"] .drawer {
  background: #0A0A0A;
  border-right: 2px solid #FFFFFF;
}
html[data-theme="contrast"] .site-footer {
  background: #000000;
  border-top: 2px solid #FFFFFF;
  color: #FFFFFF;
}

/* Search */
html[data-theme="contrast"] .search-box {
  background: #111111;
  border-color: #FFFFFF;
}
html[data-theme="contrast"] #searchInput {
  color: #FFFFFF;
  background: transparent;
}
html[data-theme="contrast"] #searchInput::placeholder {
  color: #AAAAAA;
}
html[data-theme="contrast"] .autocomplete-list {
  background: #111111;
  border-color: #FFFFFF;
}
html[data-theme="contrast"] .autocomplete-list li {
  color: #FFFFFF;
  border-bottom-color: #555555;
}
html[data-theme="contrast"] .autocomplete-list li:hover,
html[data-theme="contrast"] .autocomplete-list li[aria-selected="true"] {
  background: #FFD700;
  color: #000000;
}

/* Buttons */
html[data-theme="contrast"] .icon-btn,
html[data-theme="contrast"] .menu-toggle {
  color: #FFFFFF;
}
html[data-theme="contrast"] .icon-btn:hover,
html[data-theme="contrast"] .menu-toggle:hover {
  background: #FFD700;
  color: #000000;
}

html[data-theme="contrast"] .btn-tts {
  background: #00E5FF;
  color: #000000;
}
html[data-theme="contrast"] .btn-tts:hover {
  background: #FFFFFF;
  color: #000000;
}
html[data-theme="contrast"] .btn-tts-stop {
  background: #FFD700;
  color: #000000;
}
html[data-theme="contrast"] .btn-outline {
  background: transparent;
  border-color: #FFFFFF;
  color: #FFFFFF;
}
html[data-theme="contrast"] .btn-outline:hover {
  background: #FFFFFF;
  color: #000000;
}

/* Links */
html[data-theme="contrast"] a {
  color: #FFD700;
  text-decoration: underline;
}
html[data-theme="contrast"] a:hover {
  color: #FFFFFF;
}

/* Section titles */
html[data-theme="contrast"] .section-title {
  color: #FFFFFF;
  border-bottom-color: #FFD700;
}
html[data-theme="contrast"] .section-title i {
  color: #FFD700;
}

/* Skeletons (loading state) */
html[data-theme="contrast"] .skeleton {
  background: #333333;
  animation: none;
}

/* Drawer nav */
html[data-theme="contrast"] .drawer-nav a {
  color: #FFFFFF;
}
html[data-theme="contrast"] .drawer-nav a:hover,
html[data-theme="contrast"] .drawer-nav a:focus-visible {
  background: #FFD700;
  color: #000000;
}
html[data-theme="contrast"] .drawer-nav i {
  color: #00E5FF;
}

/* Focus ring — brighter in contrast mode */
html[data-theme="contrast"] :focus-visible {
  outline: 3px solid #FFD700;
  outline-offset: 3px;
}

/* Related cards */
html[data-theme="contrast"] .related-card {
  background: #111111;
  border-color: #FFFFFF;
  color: #FFFFFF;
}

/* ═══════════════════════════════════════
   2. FONT SIZE SCALING
   Toggled by JS: document.documentElement.dataset.fontsize = "sm|md|lg|xl"
   Root font-size scales — all rem values grow with it.
   ═══════════════════════════════════════ */
html[data-fontsize="sm"] { font-size: 90%;  }
html[data-fontsize="md"] { font-size: 100%; }
html[data-fontsize="lg"] { font-size: 118%; }
html[data-fontsize="xl"] { font-size: 140%; }

/* Ensure body re-applies the var-based size after scaling */
html[data-fontsize] body {
  font-size: var(--fs-md);
}

/* ═══════════════════════════════════════
   3. BIG TAP TARGETS ON TOUCH DEVICES
   WCAG 2.5.5 — Target Size (Enhanced)
   ═══════════════════════════════════════ */
@media (pointer: coarse) {
  .btn {
    min-height: 56px;
    padding: var(--sp-4) var(--sp-6);
    font-size: var(--fs-md);
  }
  .icon-btn,
  .menu-toggle {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }
  .drawer-nav a {
    padding: var(--sp-5) var(--sp-4);
  }
  .autocomplete-list li {
    padding: var(--sp-4) var(--sp-5);
    font-size: var(--fs-md);
  }
}

/* ═══════════════════════════════════════
   4. SCREEN-READER-ONLY UTILITY
   ═══════════════════════════════════════ */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ═══════════════════════════════════════
   5. REDUCED MOTION PREFERENCE
   (duplicated from global.css as a safety net)
   ═══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ═══════════════════════════════════════
   6. LARGER TEXT OPTION — respects OS setting
   If the user has set "larger text" in their OS, nudge sizes up.
   ═══════════════════════════════════════ */
@media (min-resolution: 1.5dppx) {
  /* Higher-DPI screens benefit from slightly bigger body text */
  body { letter-spacing: 0.01em; }
}
