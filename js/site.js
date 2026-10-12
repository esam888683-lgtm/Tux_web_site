/**
 * ============================================================
 * SITE RENDERER
 * Builds header, footer and each page from data/content.js.
 * You normally never need to edit this file — edit content.js.
 * ============================================================
 */
(() => {
    "use strict";

    const c = siteContent;
    const page = document.body.dataset.page;

    /* ---------------------------------------------------------
       Helpers
       --------------------------------------------------------- */
    const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));

    // Single place that builds every WhatsApp link on the site
    const waLink = (message) =>
        `https://wa.me/${c.contact.whatsapp}?text=${encodeURIComponent(message || c.contact.message)}`;

    const ICON_WA = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.3l-.3-.2-3.2 1 1-3.1-.2-.3C4 15 3.5 13.5 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20.2 12 20.2z"/></svg>`;

    const currentFile = (location.pathname.split("/").pop() || "index.html");

    /* ---------------------------------------------------------
       Header & footer
       --------------------------------------------------------- */
    function renderHeader() {
        const links = c.nav.map((item) => {
            const file = item.href.split("#")[0];
            const active = !item.href.includes("#") && file === currentFile ? ' aria-current="page"' : "";
            return `<a href="${esc(item.href)}"${active}>${esc(item.label)}</a>`;
        }).join("");

        document.getElementById("siteHeader").innerHTML = `
            <div class="wrap header-inner">
                <a class="brand" href="index.html" aria-label="${esc(c.brand.name)}">
                    <span class="brand-mark" aria-hidden="true">
                        <svg viewBox="0 0 64 64" width="34" height="34"><rect width="64" height="64" rx="16" fill="#0E7A5F"/><path d="M16 20a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H30l-9 8v-8h-1a6 6 0 0 1-4-6z" fill="#fff"/><rect x="23" y="22" width="18" height="3" rx="1.5" fill="#0E7A5F"/><rect x="23" y="29" width="12" height="3" rx="1.5" fill="#0E7A5F"/></svg>
                    </span>
                    <span class="brand-name">${esc(c.brand.name)}</span>
                </a>
                <nav class="main-nav" id="mainNav" aria-label="التنقل الرئيسي">${links}</nav>
                <a class="btn btn-primary btn-sm header-cta" href="${waLink()}" target="_blank" rel="noopener">${ICON_WA}<span>${esc(c.hero.primaryCta)}</span></a>
                <button class="menu-toggle" id="menuToggle" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="mainNav">
                    <span></span><span></span><span></span>
                </button>
            </div>`;

        const toggle = document.getElementById("menuToggle");
        const header = document.getElementById("siteHeader");
        toggle.addEventListener("click", () => {
            const open = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(open));
        });
        document.querySelectorAll("#mainNav a").forEach((a) =>
            a.addEventListener("click", () => {
                header.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            })
        );
    }

    function renderFooter() {
        document.getElementById("siteFooter").innerHTML = `
            <div class="wrap footer-inner">
                <div>
                    <strong>${esc(c.brand.name)}</strong>
                    <p>${esc(c.footer.note)}</p>
                </div>
                <div class="footer-contact">
                    <a href="${waLink()}" target="_blank" rel="noopener" dir="ltr">${esc(c.contact.displayNumber)}</a>
                    <span>© ${new Date().getFullYear()}</span>
                </div>
            </div>`;
    }

    /* ---------------------------------------------------------
       Shared components
       --------------------------------------------------------- */
    function workCardHtml(w) {
        const preview = w.screenshot
            ? `<div class="phone-frame"><img src="${esc(w.screenshot)}" alt="لقطة من مينيو ${esc(w.name)}" loading="lazy"></div>`
            : `<img class="work-logo" src="${esc(w.logo)}" alt="شعار ${esc(w.name)}" loading="lazy">`;
        const tags = (w.tags || []).map((t) => `<li>${esc(t)}</li>`).join("");
        const action = w.url
            ? `<a class="btn btn-outline btn-sm" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(c.worksPage.openLabel)}</a>`
            : `<span class="work-pending">${esc(c.worksPage.emptyLinkNote)}</span>`;
        return `
            <article class="work-card">
                <div class="work-preview" style="--work-color:${esc(w.color)}">${preview}</div>
                <div class="work-body">
                    <h3>${esc(w.name)}</h3>
                    <p class="work-type">${esc(w.type)}</p>
                    <p>${esc(w.description)}</p>
                    <ul class="chips">${tags}</ul>
                    <div class="work-action">${action}</div>
                </div>
            </article>`;
    }

    function ctaBandHtml(title, text, button) {
        return `
            <section class="cta-band">
                <div class="wrap cta-inner">
                    <div>
                        <h2>${esc(title)}</h2>
                        <p>${esc(text)}</p>
                    </div>
                    <a class="btn btn-accent" href="${waLink()}" target="_blank" rel="noopener">${ICON_WA}<span>${esc(button)}</span></a>
                </div>
            </section>`;
    }

    /* ---------------------------------------------------------
       Home page sections
       --------------------------------------------------------- */
    function heroHtml() {
        const h = c.hero;
        const chatLines = h.chat.lines.map((l) => {
            if (l.divider) return `<div class="chat-line chat-divider"></div>`;
            return `<div class="chat-line${l.strong ? " is-strong" : ""}">${esc(l.text)}</div>`;
        }).join("");
        const demo = c.contact.demoUrl
            ? `<a class="btn btn-ghost" href="${esc(c.contact.demoUrl)}" target="_blank" rel="noopener">جرّب ديمو حي</a>`
            : "";
        const highlights = h.highlights.map((t) => `<li>${esc(t)}</li>`).join("");

        return `
        <section class="hero">
            <div class="wrap hero-grid">
                <div class="hero-copy">
                    <h1>${esc(h.title)}</h1>
                    <p class="lead">${esc(h.subtitle)}</p>
                    <div class="hero-actions">
                        <a class="btn btn-primary" href="${waLink()}" target="_blank" rel="noopener">${ICON_WA}<span>${esc(h.primaryCta)}</span></a>
                        <a class="btn btn-outline" href="works.html">${esc(h.secondaryCta)}</a>
                        ${demo}
                    </div>
                    <ul class="hero-points">${highlights}</ul>
                </div>
                <div class="hero-visual">
                    <div class="phone" aria-label="مثال على طلب واصل على واتساب">
                        <div class="phone-notch" aria-hidden="true"></div>
                        <div class="chat-top">
                            <span class="chat-avatar" aria-hidden="true">${esc(h.chat.restaurant.charAt(0))}</span>
                            <div>
                                <strong>${esc(h.chat.restaurant)}</strong>
                                <small>طلبات المطعم</small>
                            </div>
                        </div>
                        <div class="chat-body">
                            <div class="bubble" id="orderBubble">
                                ${chatLines}
                                <span class="bubble-time">${esc(h.chat.time)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    function problemsHtml() {
        const p = c.problems;
        const rows = p.items.map((it) => `
            <div class="ps-row">
                <div class="ps-cell ps-problem"><span class="ps-tag">${esc(p.problemLabel)}</span><p>${esc(it.problem)}</p></div>
                <div class="ps-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></div>
                <div class="ps-cell ps-solution"><span class="ps-tag">${esc(p.solutionLabel)}</span><p>${esc(it.solution)}</p></div>
            </div>`).join("");

        const feats = c.features.items.map((f) => `
            <li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("");

        return `
        <section class="section section-white" id="problems">
            <div class="wrap">
                <header class="section-head">
                    <h2>${esc(p.title)}</h2>
                    <p>${esc(p.subtitle)}</p>
                </header>
                <div class="ps-list">${rows}</div>

                <div class="features">
                    <h3 class="features-title">${esc(c.features.title)}</h3>
                    <ul class="features-list">${feats}</ul>
                </div>
            </div>
        </section>`;
    }

    function howHtml() {
        const h = c.how;
        const steps = h.steps.map((s) => `
            <li>
                <div>
                    <h3>${esc(s.title)}</h3>
                    <p>${esc(s.text)}</p>
                </div>
            </li>`).join("");
        return `
        <section class="section" id="how">
            <div class="wrap how-grid">
                <header class="section-head">
                    <h2>${esc(h.title)}</h2>
                    <p>${esc(h.subtitle)}</p>
                    <p class="how-note">${esc(h.note)}</p>
                </header>
                <ol class="steps">${steps}</ol>
            </div>
        </section>`;
    }

    function worksPreviewHtml() {
        const w = c.worksSection;
        const cards = c.works.slice(0, 3).map(workCardHtml).join("");
        return `
        <section class="section section-white" id="works">
            <div class="wrap">
                <header class="section-head section-head-row">
                    <div>
                        <h2>${esc(w.title)}</h2>
                        <p>${esc(w.subtitle)}</p>
                    </div>
                    <a class="text-link" href="works.html">${esc(w.previewLinkLabel)}</a>
                </header>
                <div class="works-grid">${cards}</div>
            </div>
        </section>`;
    }

    function faqHtml() {
        const groups = c.faq.groups.map((g) => {
            const items = g.items.map((it) => `
                <details class="faq-item">
                    <summary>${esc(it.q)}</summary>
                    <p>${esc(it.a)}</p>
                </details>`).join("");
            return `
                <div class="faq-group">
                    <h3>${esc(g.title)}</h3>
                    ${items}
                </div>`;
        }).join("");
        return `
        <section class="section" id="faq">
            <div class="wrap">
                <header class="section-head"><h2>${esc(c.faq.title)}</h2></header>
                <div class="faq-grid">${groups}</div>
            </div>
        </section>`;
    }

    /* ---------------------------------------------------------
       Pages
       --------------------------------------------------------- */
    function renderHome() {
        document.getElementById("app").innerHTML =
            heroHtml() + problemsHtml() + howHtml() + worksPreviewHtml() + faqHtml() +
            ctaBandHtml(c.cta.title, c.cta.text, c.cta.button);
        playOrderAnimation();
    }

    function renderWorks() {
        const wp = c.worksPage;
        const cards = c.works.map(workCardHtml).join("");
        document.getElementById("app").innerHTML = `
            <section class="page-hero">
                <div class="wrap">
                    <h1>${esc(wp.title)}</h1>
                    <p class="lead">${esc(wp.subtitle)}</p>
                </div>
            </section>
            <section class="section section-tight">
                <div class="wrap">
                    <div class="works-grid works-grid-full">${cards}</div>
                </div>
            </section>
            ${ctaBandHtml(wp.ctaTitle, wp.ctaText, c.cta.button)}`;
    }

    /* ---------------------------------------------------------
       The one animated moment: the sample order "arrives" line
       by line inside the phone mockup. Skipped for people who
       prefer reduced motion.
       --------------------------------------------------------- */
    function playOrderAnimation() {
        const lines = document.querySelectorAll("#orderBubble .chat-line");
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            lines.forEach((l) => l.classList.add("is-in"));
            return;
        }
        lines.forEach((l, i) => setTimeout(() => l.classList.add("is-in"), 500 + i * 260));
    }

    /* ---------------------------------------------------------
       Init
       --------------------------------------------------------- */
    document.title = page === "works"
        ? `${c.worksPage.title} | ${c.brand.name}`
        : `${c.brand.name} | مينيو إلكتروني للمطاعم`;

    renderHeader();
    if (page === "works") renderWorks(); else renderHome();
    renderFooter();
})();
