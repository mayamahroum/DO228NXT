import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gaLogo from "./assets/Logo/GA-ATS CMYK blue.png";
import missionVideo from "https://dev.markenzoo.de/temp_GA_flugzeug/Do228_video1.mp4";
import scrollBackgroundVideo from "https://dev.markenzoo.de/temp_GA_flugzeug/Do228_scrollbackground.mp4";
import performanceImage from "./assets/Bilder-webp/Do228_003.webp";
import missionImageSpecial from "./assets/Bilder-webp/Do228_033.webp";
import missionImagePassenger from "./assets/Bilder-webp/Do228_007.webp";
import missionImageCargo from "./assets/Bilder-webp/Do228_008.webp";
import cockpitImage from "./assets/Bilder-webp/Do228_Cockpit.webp";
import islandImage from "./assets/Bilder-webp/Do228_023.webp";
import arcticImage from "./assets/Bilder-webp/Do228_024.webp";
import "./version2.css";

const ENABLE_ANIMATIONS = true;

const missionCards = [
  {
    title: "Spezialmissionen",
    text: "Maritime Patrouille, Grenzueberwachung und Aufklaerung mit flexibler Sensorintegration.",
    image: missionImageSpecial,
  },
  {
    title: "Passagiertransport",
    text: "Bis zu 19 Passagiere, STOL-Faehigkeit und stabile Operation auf kurzen Bahnen.",
    image: missionImagePassenger,
  },
  {
    title: "Frachttransport",
    text: "Hohe Nutzlast mit effizienter Versorgung abgelegener Regionen und Inselstrecken.",
    image: missionImageCargo,
  },
];

const horizontalCases = [
  { title: "Arktische Einsaetze", text: "Zuverlaessiger Betrieb bei rauem Klima und entlegenen Basen.", image: arcticImage },
  { title: "Inselverkehr", text: "Wirtschaftliche Verbindungen fuer kurze Strecken und kleine Infrastruktur.", image: islandImage },
  { title: "Forschung", text: "Schnelle Umruestung fuer Messkampagnen und Testinstrumente.", image: cockpitImage },
  { title: "Grenzschutz", text: "Dauerhafte Lagebilder durch Ausdauer, Sensorik und niedrige Betriebskosten.", image: missionImageSpecial },
  { title: "MedEvac", text: "Konfigurierbare Kabine fuer schnelle Evakuierung auch auf unbefestigten Pisten.", image: missionImagePassenger },
];

const techStats = [
  { label: "Passagiere", value: "bis 19" },
  { label: "Einsatzdauer", value: "8+ h" },
  { label: "MTOW", value: "14.550 lb" },
  { label: "Hardpoints", value: "4" },
];

const layeredPanels = [
  {
    title: "Kabine fuer Mehrrollenbetrieb",
    text: "Schneller Wechsel zwischen Passagier-, Fracht- und Missionskonfiguration.",
    image: missionImageSpecial,
  },
  {
    title: "Modulares Missionssetup",
    text: "Sensorik, Konsole und Kommunikationssysteme werden missionsspezifisch kombiniert.",
    image: missionImagePassenger,
  },
  {
    title: "Skalierbare Plattform",
    text: "Eine Architektur fuer zivile und behoerdliche Betreiber mit klarer Lebenszykluslogik.",
    image: missionImageCargo,
  },
];

export default function Version2() {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ENABLE_ANIMATIONS || reduced) {
      rootRef.current?.classList.add("v2-static");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".v2-hero-animate",
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.84, stagger: 0.09, ease: "power3.out" }
      );

      gsap.utils.toArray(".v2-reveal").forEach((el, index) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: Math.min(index * 0.03, 0.15),
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.to(".v2-platform-image", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".v2-platform",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const track = document.querySelector(".v2-horizontal-track");
      if (track) {
        const moveBy = Math.max(0, track.scrollWidth - window.innerWidth);
        if (moveBy > 0) {
          gsap.to(track, {
            x: -moveBy,
            ease: "none",
            scrollTrigger: {
              trigger: ".v2-horizontal",
              start: "top top",
              end: () => `+=${moveBy}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });
        }
      }

      const scrubVideo = document.querySelector(".v2-scrub-video");
      if (scrubVideo) {
        const state = { t: 0 };
        const setup = () => {
          const maxT = Math.max(0, (scrubVideo.duration || 0) - 0.05);
          if (!maxT) return;
          scrubVideo.pause();
          gsap.to(state, {
            t: maxT,
            ease: "none",
            scrollTrigger: {
              trigger: ".v2-scrub",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
            onUpdate: () => {
              if (Math.abs(scrubVideo.currentTime - state.t) > 0.016) {
                scrubVideo.currentTime = state.t;
              }
            },
          });
        };

        if (scrubVideo.readyState >= 1) setup();
        else scrubVideo.addEventListener("loadedmetadata", setup, { once: true });
      }

      gsap.utils.toArray(".v2-layer-panel").forEach((panel, index) => {
        gsap.fromTo(
          panel,
          { yPercent: 20 + index * 8, scale: 0.95 - index * 0.01, autoAlpha: 0.55 },
          {
            yPercent: 0,
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".v2-layered",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".v2-tech-card",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".v2-tech-grid",
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="v2-site" ref={rootRef} id="top">
      <header className="v2-header">
        <a href="#top" className="v2-brand" aria-label="Startseite">
          <img src={gaLogo} alt="GA-ATS" />
        </a>
        <nav className="v2-nav" aria-label="Hauptnavigation">
          <a href="#plattform">Plattform</a>
          <a href="#missionen">Missionen</a>
          <a href="#einsatzprofile">Einsatzprofile</a>
          <a href="#daten">Technische Daten</a>
        </nav>
        <a className="v2-cta" href="#kontakt">Kontakt</a>
      </header>

      <main>
        <section className="v2-hero" aria-label="Do228 NXT Uebersicht">
          <video
            className="v2-hero-video"
            src={missionVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="v2-hero-shade" />
          <div className="v2-container v2-hero-layout">
            <div className="v2-hero-copy">
              <p className="v2-kicker v2-hero-animate">Do228 NXT</p>
              <h1 className="v2-hero-animate">Die Plattform fuer flexible Missionen mit klarer Wirtschaftlichkeit.</h1>
              <p className="v2-hero-animate">
                Die Do228 NXT kombiniert STOL-Performance, robuste Betriebseigenschaften und modulare Konfiguration
                fuer Passagier-, Fracht- und Spezialmissionen.
              </p>
              <div className="v2-hero-actions v2-hero-animate">
                <a href="#plattform" className="v2-btn v2-btn-primary">Plattform entdecken</a>
                <a href="#daten" className="v2-btn v2-btn-ghost">Daten ansehen</a>
              </div>
            </div>
            <aside className="v2-glass-card v2-hero-panel v2-hero-animate" aria-label="Kernwerte">
              {techStats.map((stat) => (
                <div key={stat.label}>
                  <p>{stat.label}</p>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="v2-platform" id="plattform">
          <div className="v2-container v2-platform-grid">
            <div className="v2-platform-copy v2-reveal">
              <p className="v2-kicker">Plattform</p>
              <h2>Entwickelt fuer mission-kritische Operationen in wechselnden Umgebungen.</h2>
              <p>
                Die Plattform basiert auf einer bewaehrten Architektur mit modernisierter Fertigung, klarer
                Wartungslogik und hoher Verfuegbarkeit. Betreiber erhalten eine robuste Basis, die langfristig
                wirtschaftlich betrieben werden kann.
              </p>
              <p>
                Durch den rechteckigen Kabinenquerschnitt und modulare Schnittstellen laesst sich die Do228 NXT
                schnell auf unterschiedliche Einsatzprofile abstimmen.
              </p>
            </div>
            <figure className="v2-platform-media v2-reveal">
              <img className="v2-platform-image" src={performanceImage} alt="Do228 NXT im Einsatz" loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        <section className="v2-missions" id="missionen">
          <div className="v2-container">
            <div className="v2-section-head v2-reveal">
              <p className="v2-kicker">Missionen</p>
              <h2>Drei Kernrollen einer gemeinsamen Plattform.</h2>
            </div>
            <div className="v2-mission-grid">
              {missionCards.map((item) => (
                <article className="v2-mission-card v2-reveal" key={item.title}>
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="v2-horizontal-wrap" id="einsatzprofile">
          <div className="v2-container v2-section-head v2-reveal">
            <p className="v2-kicker">Einsatzprofile</p>
            <h2>Globale Missionsszenarien im horizontalen Storyflow.</h2>
          </div>
          <section className="v2-horizontal" aria-label="Horizontale Einsatzprofile">
            <div className="v2-horizontal-track">
              {horizontalCases.map((item) => (
                <article className="v2-h-card" key={item.title}>
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <div className="v2-h-overlay">
                    <p>{item.title}</p>
                    <h3>{item.text}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="v2-scrub" aria-label="Video auf Scrollposition">
          <div className="v2-scrub-sticky">
            <video className="v2-scrub-video" src={scrollBackgroundVideo} muted playsInline preload="metadata" />
            <div className="v2-container v2-scrub-copy">
              <div className="v2-glass-card v2-reveal">
                <p className="v2-kicker">Motion Story</p>
                <h2>Video-Playback synchron zur Scrollposition.</h2>
                <p>
                  Die Sequenz visualisiert Flugprofil und Missionsumfeld praezise entlang der Nutzerinteraktion.
                  Das schafft Kontrolle, Rhythmus und eine nachvollziehbare Storyline.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="v2-layered" aria-label="Ueberlagerte Sektionen">
          <div className="v2-layered-sticky">
            {layeredPanels.map((item, index) => (
              <article className="v2-layer-panel" key={item.title} style={{ zIndex: layeredPanels.length - index }}>
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="v2-tech" id="daten">
          <div className="v2-container">
            <div className="v2-section-head v2-reveal">
              <p className="v2-kicker">Technische Daten</p>
              <h2>Kennzahlen, die die Einsatzfaehigkeit klar belegen.</h2>
            </div>
            <div className="v2-tech-grid">
              {techStats.map((item) => (
                <article className="v2-tech-card" key={item.label}>
                  <p>{item.label}</p>
                  <h3>{item.value}</h3>
                </article>
              ))}
            </div>
            <div className="v2-tech-footnote v2-reveal">
              <p>
                Weitere Konfigurationsdaten, Missionsausstattung und Zertifizierungsdetails werden projektspezifisch
                bereitgestellt.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="v2-footer" id="kontakt">
        <div className="v2-container v2-footer-grid">
          <div>
            <p className="v2-kicker">Do228 NXT</p>
            <h2>Gebaut fuer Missionen mit Anspruch.</h2>
          </div>
          <div>
            <p>General Atomics AeroTec Systems GmbH</p>
            <a href="mailto:info@ga-ats.com">info@ga-ats.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
