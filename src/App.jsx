import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gaLogo from "./assets/Logo/GA-ATS CMYK blue.png";
import gaLogoWhite from "./assets/Logo/ATS RGB white.png";
import performanceImage from "./assets/Bilder-webp/Do228_024.webp";
import missionImageSpecial from "./assets/Bilder-webp/Do228_033.webp";
import missionImagePassenger from "./assets/Bilder-webp/Do228_034.webp";
import missionImageCargo from "./assets/Bilder-webp/Do228_029.webp";
import missionVideo from "https://dev.markenzoo.de/files/temp_GA_flugzeug/Do228_video1.mp4";
import scrollBackgroundVideo from "https://dev.markenzoo.de/files/temp_GA_flugzeug/Do228_scrollbackground_scrub.mp4";

import "./App.css";

const HARD_LITE_MODE = false;
const ENABLE_GSAP = true;
const HERO_ALIGNMENT = "bottom"; // "bottom" or "center"


const strengthsTabs = [
  {
    id: "flugbetrieb",
    label: "Flugbetrieb",
    lead: "Leistungsstarker Betrieb für kurze Bahnen und hohe Einsatzreichweite.",
    image: missionImagePassenger,
    date: "Seit 1982",
    points: [
      "Größtes Nutzlast-/Reichweiten-Verhältnis",
      "Hohe Reisegeschwindigkeit und verschiedene Betriebsgeschwindigkeiten",
      "Mehr als 6 Stunden Flugzeit",
      "STOL-Fähigkeit und zertifiziert für unbefestigte Landebahnen",
    ],
  },
  {
    id: "wirtschaftlichkeit",
    label: "Wirtschaftlichkeit",
    lead: "Niedrige laufende Kosten bei hoher Verfügbarkeit der Plattform.",
    image: performanceImage,
    date: "Niedrige Betriebskosten",
    points: [
      "Niedrigste Betriebskosten pro Flugstunde",
      "Niedrigster Kraftstoffverbrauch in ihrer Klasse",
      "Geringer Wartungsbedarf und geringe Wartungskosten",
      "Lange Betriebsdauer des Flugzeugs",
    ],
  },
  {
    id: "missionen",
    label: "Missionen",
    lead: "Flexible Kabinenkonzepte für wechselnde Einsatzprofile in kurzer Zeit.",
    image: missionImageSpecial,
    date: "Flexible Konfiguration",
    points: [
      "Optimierter rechteckiger Kabinenraum mit zusätzlichem Platz",
      "Vielseitige Optionen für das Kabinenlayout",
      "Zahlreiche Sensor- und Missionsequipment-Optionen",
      "Einfacher und schneller Umbau zwischen verschiedenen Kabinenlayouts",
    ],
  },
  {
    id: "transport",
    label: "Transport",
    lead: "Hohe Nutzlast mit schneller Umrüstbarkeit für Passagier und Fracht.",
    image: missionImageCargo,
    date: "Bis 6.575 kg MTOW",
    points: [
      "Einzigartige Nutzlastkapazität",
      "Bis zu 14.495 lbs / 6.575 kg MTOW",
      "Vier Hardpoints unter den Flügeln verfügbar",
      "Einfacher Umbau der Tür zu einer Frachttür",
    ],
  },
];

const strengthsTabsExtended = [...strengthsTabs, ...strengthsTabs].map((tab, index) => ({
  ...tab,
  id: `${tab.id}-extra-${index + 1}`,
}));

const aircraftWordRevealSentence =
  "Robust. Vielseitig. Einsatzbereit.";
const aircraftWordRevealWords = aircraftWordRevealSentence.split(" ");

const detectLiteMode = () => {
  if (HARD_LITE_MODE) return true;
  if (typeof window === "undefined") return false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 6;
  const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  return prefersReducedMotion || lowCpu || lowMemory;
};

export default function App() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const perfLite = detectLiteMode();

  useEffect(() => {
    if (!ENABLE_GSAP) {
      rootRef.current?.classList.add("no-gsap");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

    rootRef.current?.classList.toggle("perf-lite", perfLite);

    if (perfLite && !ScrollTrigger.isTouch) {
      ScrollTrigger.normalizeScroll(true);
    }

    const preloadedStoryMedia = [];
    let storyMediaObserver;
    let scrollVideoSourceObserver;

    const primeStoryCardMedia = () => {
      const storyImages = Array.from(document.querySelectorAll(".story-card-media"));
      storyImages.forEach((img) => {
        if (img.dataset.preloaded === "1") return;
        const src = img.currentSrc || img.src;
        if (!src) return;

        img.dataset.preloaded = "1";
        const preload = new Image();
        preload.decoding = "async";
        preload.src = src;
        preloadedStoryMedia.push(preload);
      });
    };

    if ("IntersectionObserver" in window) {
      const strengthsSection = document.querySelector(".strengths-proto");
      if (strengthsSection) {
        storyMediaObserver = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              primeStoryCardMedia();
              storyMediaObserver?.disconnect();
            }
          },
          { rootMargin: "900px 0px" }
        );
        storyMediaObserver.observe(strengthsSection);
      } else {
        primeStoryCardMedia();
      }
    } else {
      primeStoryCardMedia();
    }

    const ctx = gsap.context(() => {
      if (perfLite) {

        gsap.set(".js-hero-title", { autoAlpha: 1, y: 0 });
        gsap.set(".js-hero-subhead", { autoAlpha: 0.92, y: 0 });
        gsap.set(".js-hero-meta", { autoAlpha: 0.9, y: 0 });
        gsap.set(".js-hero-cta", { autoAlpha: 1, y: 0 });
        gsap.set(".js-first-panel", { yPercent: 0 });
      } else {
        gsap.set(".js-hero-title", { autoAlpha: 0, y: 64, scale: 0.82, rotate: -1.4 });
        gsap.set(".js-hero-subhead", { autoAlpha: 0, y: 52, scale: 0.94 });
        gsap.set(".js-hero-meta", { autoAlpha: 0, y: 34 });
        gsap.set(".js-hero-cta", { autoAlpha: 0, y: 28, scale: 0.94 });
        gsap.set(".js-first-panel", { yPercent: 0 });

        gsap.timeline({ defaults: { ease: "power4.out", delay: 0.25 } })
          .to(".js-hero-title", { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 1.85 }, 0)
          .to(".js-hero-subhead", { autoAlpha: 0.92, y: 0, scale: 1, duration: 1.45 }, 0.34)
          .to(".js-hero-meta", { autoAlpha: 0.9, y: 0, duration: 1.2 }, 0.74)
          .to(".js-hero-cta", { autoAlpha: 1, y: 0, scale: 1, duration: 1.2 }, 0.94);
      }

      const accordionItems = gsap.utils.toArray(".js-highlight-accordion");
      const accordionSection = document.querySelector(".highlights-board");
      if (accordionItems.length && accordionSection) {
        const setActiveByIndex = (activeIndex) => {
          accordionItems.forEach((item, index) => item.classList.toggle("is-active", index === activeIndex));
        };

        if (!perfLite) {
          gsap.fromTo(
            accordionItems,
            {
              autoAlpha: 0,
              x: -80,
              y: (index) => 16 + index * 10,
              rotate: -1.2,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotate: 0,
              duration: 0.72,
              ease: "power3.out",
              stagger: 0.08,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: accordionSection,
                start: "top 86%",
                toggleActions: "play none none none",
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
        accordionItems.forEach((item, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveByIndex(index),
            onEnterBack: () => setActiveByIndex(index),
            invalidateOnRefresh: true,
          });
        });

        setActiveByIndex(0);
      }

      const scrollVideo = document.querySelector(".js-scroll-video");
      const scrollVideoSection = document.querySelector(".js-scroll-video-section");
      if (scrollVideo && scrollVideoSection) {
        const setupScrollVideo = () => {
          scrollVideo.pause();
          gsap.timeline({
            defaults: { duration: 1, ease: "none" },
            scrollTrigger: {
              trigger: scrollVideoSection,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }).fromTo(scrollVideo, { currentTime: 0 }, { currentTime: Math.max(0.01, (scrollVideo.duration || 1) - 0.05) });

          const activateIOSVideo = () => {
            scrollVideo.play().then(() => scrollVideo.pause()).catch(() => {});
            document.documentElement.removeEventListener("touchstart", activateIOSVideo);
          };
          document.documentElement.addEventListener("touchstart", activateIOSVideo, { passive: true });

          ScrollTrigger.refresh();
        };

        const setupWhenReady = () => {
          if (scrollVideo.readyState >= 1) {
            setupScrollVideo();
          } else {
            scrollVideo.addEventListener("loadedmetadata", setupScrollVideo, { once: true });
          }
        };

        const primeScrollVideoSource = () => {
          if (scrollVideo.getAttribute("src")) return;
          scrollVideo.setAttribute("src", scrollBackgroundVideo);
          scrollVideo.load();
          setupWhenReady();
        };

        if ("IntersectionObserver" in window) {
          scrollVideoSourceObserver = new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                primeScrollVideoSource();
                scrollVideoSourceObserver?.disconnect();
              }
            },
            { rootMargin: "1200px 0px" }
          );
          scrollVideoSourceObserver.observe(scrollVideoSection);
        } else {
          primeScrollVideoSource();
        }
      }

      const statsSection = document.querySelector(".js-brochure-section");
      if (statsSection) {
        const statCards = gsap.utils.toArray(".js-brochure-stat");
        const missionTags = gsap.utils.toArray(".js-brochure-mission");
        const brochureTitle = document.querySelector(".js-brochure-title");
        const brochureTagsWrap = document.querySelector(".js-brochure-tags");
        const brochureLead = document.querySelector(".js-brochure-lead");
        const brochureStatsWrap = document.querySelector(".js-brochure-stats");

        if (!perfLite && statCards.length) {
          gsap.fromTo(
            statCards,
            { autoAlpha: 0, y: 36, rotateX: -8 },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.72,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: statsSection,
                start: "top 78%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        }

        const numberEls = gsap.utils.toArray(".js-brochure-value");
        numberEls.forEach((el) => {
          const target = Number(el.dataset.target || "0");
          const decimals = Number(el.dataset.decimals || "0");
          const prefix = el.dataset.prefix || "";
          const suffix = el.dataset.suffix || "";
          const state = { value: 0 };

          const render = () => {
            if (decimals > 0) {
              el.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`;
              return;
            }
            el.textContent = `${prefix}${Math.round(state.value).toLocaleString("de-DE")}${suffix}`;
          };

          render();
          gsap.to(state, {
            value: target,
            duration: 1.35,
            ease: "power2.out",
            onUpdate: render,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          });
        });

        if (!perfLite && missionTags.length) {
          gsap.fromTo(
            missionTags,
            { autoAlpha: 0, y: 20, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.52,
              ease: "power2.out",
              stagger: 0.05,
              scrollTrigger: {
                trigger: ".js-brochure-missions-wrap",
                start: "top 84%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (!perfLite) {
          const smoothTl = gsap.timeline({
            scrollTrigger: {
              trigger: statsSection,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          if (brochureTitle) {
            smoothTl.fromTo(
              brochureTitle,
              { yPercent: 10, autoAlpha: 0.78 },
              { yPercent: -10, autoAlpha: 1, ease: "none" },
              0
            );
          }

          if (brochureLead) {
            smoothTl.fromTo(
              brochureLead,
              { yPercent: 8, autoAlpha: 0.74 },
              { yPercent: -6, autoAlpha: 1, ease: "none" },
              0
            );
          }

          if (brochureStatsWrap) {
            smoothTl.fromTo(
              brochureStatsWrap,
              { yPercent: 6, autoAlpha: 0.82 },
              { yPercent: -6, autoAlpha: 1, ease: "none" },
              0
            );
          }

          if (brochureTagsWrap) {
            smoothTl.fromTo(
              brochureTagsWrap,
              { yPercent: 5, autoAlpha: 0.82 },
              { yPercent: -5, autoAlpha: 1, ease: "none" },
              0
            );
          }
        }

        const advantageCards = gsap.utils.toArray(".js-adv-card");
        if (!perfLite && advantageCards.length) {
          gsap.fromTo(
            advantageCards,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: ".js-advantages-grid",
                start: "top 84%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        }

        const worldCards = gsap.utils.toArray(".js-world-card");
        if (!perfLite && worldCards.length) {
          gsap.fromTo(
            worldCards,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.52,
              ease: "power2.out",
              stagger: 0.05,
              scrollTrigger: {
                trigger: ".js-world-grid",
                start: "top 86%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }

      const missionCards = gsap.utils.toArray(".js-mission-card");
      if (missionCards.length) {
        const setMissionFocus = (activeIndex) => {
          missionCards.forEach((card, index) => {
            card.classList.toggle("is-focus", index === activeIndex);
          });
        };

 
        setMissionFocus(0);
      }

      const revealTargets = gsap.utils.toArray([
        ".js-first-panel .panel-kicker",
        ".js-first-panel h2",
        ".js-first-panel p:not(.js-story-word-sentence)",
        ".missions > .panel-kicker",
        ".missions > h3",
        ".site-footer-kicker",
        ".site-footer-brand h3",
        ".site-footer-col h4",
        ".site-footer-col p",
        ".site-footer-col a",
        ".site-footer-meta p",
      ]);

      if (!perfLite && revealTargets.length) {
        revealTargets.forEach((el, index) => {
          const fromLeft = index % 2 === 0;
          gsap.fromTo(
            el,
            { autoAlpha: 0, x: fromLeft ? -52 : 52 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }

      const wordRevealWords = gsap.utils.toArray(".js-story-quote-word");
      if (wordRevealWords.length) {
        gsap.set(wordRevealWords, { color: "#d5dce4" });
        ScrollTrigger.create({
          trigger: ".js-story-quote-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const count = wordRevealWords.length;
            const COMPLETE_AT = 0.5;
            const normalizedProgress = Math.min(1, self.progress / COMPLETE_AT);
            const activeCount = Math.min(count, Math.floor(normalizedProgress * count));
            wordRevealWords.forEach((el, index) => {
              el.style.color = index < activeCount ? "#171717" : "#d5dce4";
            });
          },
        });
      }

      if (!perfLite) {
        gsap.fromTo(
          ".performance-inner",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".performance-section",
              start: "top 84%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );

        gsap.fromTo(
          ".performance-copy .panel-kicker, .performance-copy h3, .performance-copy p",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: ".performance-section",
              start: "top 82%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );

        const strengthsTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".strengths-proto",
            start: "top 80%",
            once: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.out" },
        });

        strengthsTl.fromTo(
          ".strengths-proto-head",
          { autoAlpha: 0, y: 18, force3D: true },
          { autoAlpha: 1, y: 0, duration: 0.36 }
        );
      }

      const horizontalStrengthsSection = document.querySelector(".js-strengths-horizontal");
      const horizontalStrengthsPin = document.querySelector(".js-strengths-horizontal-pin");
      const horizontalStrengthsViewport = document.querySelector(".js-strengths-horizontal-viewport");
      const horizontalStrengthsTrack = document.querySelector(".js-strengths-horizontal-track");
      if (horizontalStrengthsSection && horizontalStrengthsPin && horizontalStrengthsViewport && horizontalStrengthsTrack) {
        const getHorizontalDistance = () => {
          const lastCard = horizontalStrengthsTrack.lastElementChild;
          if (!lastCard) return 0;
          const lastRight = lastCard.offsetLeft + lastCard.offsetWidth;
          return Math.max(0, lastRight - horizontalStrengthsViewport.clientWidth);
        };
        const PIN_SCROLL_FACTOR = 0.58;
  
        const getPinDistance = () => getHorizontalDistance() * PIN_SCROLL_FACTOR;
        const getHeaderOffset = () => {
          const headerEl = headerRef.current;
          if (!headerEl) return 0;
          return Math.max(0, Math.ceil(headerEl.getBoundingClientRect().height));
        };

        if (!perfLite && !ScrollTrigger.isTouch && getHorizontalDistance() > 12) {
          horizontalStrengthsSection.classList.add("is-horizontal-active");
          gsap.set(horizontalStrengthsTrack, { x: 0 });

          ScrollTrigger.create({
            trigger: horizontalStrengthsPin,
            start: () => `top top+=${getHeaderOffset()}`,
            end: () => `+=${getPinDistance()}`,
            pin: horizontalStrengthsPin,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const moveProgress = self.progress;
              gsap.set(horizontalStrengthsTrack, { x: -getHorizontalDistance() * moveProgress });
            },
          });
        } else {
          horizontalStrengthsSection.classList.add("is-native-scroll");
        }
      }

    }, rootRef);

    return () => {
      storyMediaObserver?.disconnect();
      scrollVideoSourceObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const applyHeaderState = () => {
      if (headerRef.current) {
        const threshold = Math.max(80, window.innerHeight * 0.18);
        const isScrolled = window.scrollY > threshold;
        headerRef.current.classList.toggle("is-scrolled", isScrolled);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyHeaderState);
      }
    };

    const onResize = () => {
      onScroll();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="app-shell" ref={rootRef} id="top">
      <header className="site-header" ref={headerRef}>
        <div className="brand-wrap">
          <img className="brand-logo brand-logo-color" src={gaLogo} alt="GA-ATS Logo" />
          <img className="brand-logo brand-logo-white" src={gaLogoWhite} alt="GA-ATS Logo Weiß" />
        </div>
        <nav>
          <a href="#aircraft">Das Flugzeug</a>
          <a href="#operations">Missionsbereiche</a>
          <a href="#operations">Spitzenleistung</a>
          <a href="#contact">Technische Daten</a>
        </nav>
      </header>

      <main>
        <div className="hero">
          <video
            className="hero-video"
            src={missionVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={missionImageSpecial}
            aria-hidden="true"
          />
          <div className={`hero-content hero-content--${HERO_ALIGNMENT}`}>
            <div className="hero-title-mask">
              <h1 className="hero-title js-hero-title">DO228 NXT</h1>
              <p className="hero-subhead js-hero-subhead">DAS FLUGZEUG FÜR MODERNE MISSIONEN.</p>
            
            </div>
            <a className="hero-cta js-hero-cta" href="#aircraft">Mehr erfahren</a>
            
          </div>
        </div>

        <section className="story-panel js-first-panel" id="aircraft">
            <div className="story-copy">
              <p className="panel-kicker">Das Flugzeug</p>
              <h2>Die Do228 - Das vielseitige Missionsflugzeug</h2>
              <p>
                Die Do228 NXT ist ein vielseitiges zweimotoriges Turboprop-Flugzeug, das für seine
                zuverlässige Leistung und seine Kurzstart- und Landeeigenschaften (STOL) bekannt ist.
                Sie wurde für den Passagier- und Frachttransport sowie für Spezialeinsätze entwickelt
                und hat sich in anspruchsvollen Umgebungen bewahrt. Mit ihrer hohen Effizienz, der
                geräumigen Kabine, der vielseitigen Ausstattung, den flexiblen Layouts und der
                fortschrittlichen Avionik ist die Do228 eine zuverlässige Wahl für Betreiber weltweit.
              </p>
              <p>
                Basierend auf der über 40-jährigen Erfolgsgeschichte und Zuverlässigkeit der Do228
                wurde die nächste Generation - die Do228 NXT - entwickelt. Diese zeichnet sich durch
                eine erneuerte Lieferkette, ein modernisiertes Cockpit, einer verstärkten Eigenfertigung
                von Komponenten und verschiedenen weiteren Verbesserungen aus. Die Do228 NXT vereint
                Sicherheit und Effizienz wie kein anderes Flugzeug in ihrer Klasse.
              </p>
            </div>
          </section>

        <section className="story-quote-section js-story-quote-section" aria-label="Do228 Leitsatz">
          <div className="story-quote-sticky">
            <div className="story-quote-layout">
              <figure className="story-quote-media">
                <video
                  className="story-quote-media-video"
                  src={missionVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              </figure>
              <p className="story-quote-sentence" aria-label="Leitsatz">
                {aircraftWordRevealWords.map((word, index) => (
                  <span className="story-quote-word js-story-quote-word" key={`aircraft-word-${index}`}>
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>



          <section className="mission-showcase" id="operations">
            <div className="missions">
              <p className="panel-kicker">Missionsbereiche</p>
              <h3>Drei Kernmissionen der Do228 NXT</h3>
              <div className="missions-media" aria-label="Kernmissionen">
                <article className="missions-media-card missions-media-card-special js-mission-card">
                  <img
                    className="missions-media-bg"
                    src={missionImageSpecial}
                    alt="Spezialmissionen der Do228 NXT"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="missions-media-content">
                    <span className="missions-media-tag">01</span>
                    <h4>Spezialmissionen</h4>
                    <p className="missions-media-desc">Maritime Patrouille, Grenzüberwachung, Aufklärung und MedEvac mit flexibler Sensorausstattung.</p>
                  </div>
                </article>
                <article className="missions-media-card missions-media-card-passenger js-mission-card">
                  <img
                    className="missions-media-bg"
                    src={missionImagePassenger}
                    alt="Passagiertransport mit der Do228 NXT"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="missions-media-content">
                    <span className="missions-media-tag">02</span>
                    <h4>Passagiertransport</h4>
                    <p className="missions-media-desc">Zuverlässiger Transport von bis zu 19 Personen, auch auf kurzen und unbefestigten Landebahnen.</p>
                  </div>
                </article>
                <article className="missions-media-card missions-media-card-cargo js-mission-card">
                  <img
                    className="missions-media-bg"
                    src={missionImageCargo}
                    alt="Frachttransport mit der Do228 NXT"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="missions-media-content">
                    <span className="missions-media-tag">03</span>
                    <h4>Frachttransport</h4>
                    <p className="missions-media-desc">Effiziente Versorgung entlegener Regionen mit hoher Nutzlast und starker STOL-Performance.</p>
                  </div>
                </article>
              </div>

            </div>
          </section>



          <section className="strengths-horizontal js-strengths-horizontal" aria-label="Weitere Vorteile im horizontalen Scroll">
            <div className="strengths-horizontal-pin js-strengths-horizontal-pin">
              <div className="strengths-horizontal-head">
                <p className="panel-kicker">Ihre Vorteile</p>
                <h3>Do228 NXT Vorteile</h3>
              </div>
              <div className="strengths-horizontal-viewport js-strengths-horizontal-viewport">
                <div className="story-cards-row-horizontal js-strengths-horizontal-track">
                  {strengthsTabsExtended.map((tab, index) => (
                    <article className="story-card story-card--horizontal" key={`story-horizontal-${tab.id}`}>
                    <div className="story-card-media-wrap">
                      <img
                        className="story-card-media"
                        src={tab.image}
                        alt={`${tab.label} ${index + 1}`}
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                      />
                    </div>
                    <div className="story-card-head">
                      <h4>{tab.label}</h4>
                      <p className="story-card-lead">{tab.lead}</p>
                      <p className="story-card-date">{tab.date}</p>
                    </div>
                    <ul className="story-card-points" aria-label={`${tab.label} Kernpunkte`}>
                      {tab.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>


    


        <section className="scroll-video-section js-scroll-video-section" aria-label="Do228 Scroll-Video">
          <div className="scroll-video-sticky">
            <video
              className="scroll-video-media js-scroll-video"
              muted
              playsInline
              preload="metadata"
              poster={missionImageSpecial}
              aria-hidden="true"
            />
          </div>
        </section>
        <footer className="site-footer" id="contact" aria-label="Fußbereich">
          <div className="site-footer-inner">
            <div className="site-footer-brand">
              <p className="site-footer-kicker">Do228 NXT</p>
              <h3>Für Missionen mit Anspruch.</h3>
            </div>

            <div className="site-footer-col">
              <h4>Kontakt</h4>
              <p>General Atomics AeroTec Systems GmbH</p>
              <a href="mailto:info@ga-ats.com">info@ga-ats.com</a>
              <a href="tel:+498150000000">+49 8150 000000</a>
            </div>

            <div className="site-footer-col">
              <h4>Navigation</h4>
              <a href="#aircraft">Das Flugzeug</a>
              <a href="#operations">Missionsbereiche</a>
              <a href="#contact">Technische Daten</a>
            </div>

            <div className="site-footer-col">
              <h4>Rechtliches</h4>
              <a href="#">Impressum</a>
              <a href="#">Datenschutz</a>
            </div>
          </div>

          <div className="site-footer-meta">
            <p>© 2026 General Atomics AeroTec Systems. Alle Rechte vorbehalten.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
