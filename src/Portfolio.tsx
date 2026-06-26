import { useState, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import type { Color as TColor } from "three";   // type-only — erased at build, keeps three OUT of the main bundle
import {
  Mail, FileText, ArrowUpRight, Terminal,
  Sparkles, Code2, Server, Brain, MapPin, Hand, Printer, QrCode,
  Dices, Menu, X, Rocket, GitBranch, Lock, ShoppingBag, Zap, ZapOff,
  Palette, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */
interface Project {
  featured: boolean;
  icon: LucideIcon;
  title: string;
  tag: string;
  desc: string;
  stack: string[];
  link: string;
}
interface Experience {
  role: string;
  org: string;
  place: string;
  period: string;
  points: string[];
}
interface SkillGroup {
  label: string;
  icon: LucideIcon;
  items: string[];
  inProgress?: boolean;
}
interface RoadmapItem { phase: string; title: string; detail: string; done: boolean; }
interface IdeaItem { icon: LucideIcon; title: string; note: string; }
interface PaletteDef { name: string; a: string; b: string; }
type ThemeState = { mode: "auto" } | { mode: "manual"; a: string; b: string };

/* ============================================================
   ⚙️  CONTENT — edit freely.
   ============================================================ */
const PROFILE = {
  name: "Jay Gohil",
  tagline: "Systems & Support Engineer → AI / ML",
  blurb:
    "5+ years turning messy enterprise IT into reliable, automated systems — Microsoft 365, hybrid Active Directory, endpoint management. Now building toward Machine Learning & AI engineering, one shipped project at a time.",
  location: "Kingston, ON · Canada",
  links: {
    email: "mailto:you@example.com",
    linkedin: "https://linkedin.com/in/your-handle",
    github: "https://github.com/your-handle",
    resume: "#",
  },
};

const SNAPSHOT: [string, string][] = [
  ["Based in", "Kingston, ON"],
  ["Focus now", "Systems & IT Support"],
  ["Building toward", "AI / ML Engineering"],
];
const SNAPSHOT_STACK = ["Microsoft 365", "Python", "Active Directory", "Automation"];

const PROJECTS: Project[] = [
  { featured: true, icon: Hand, title: "Heart AR", tag: "Creative Tech · In Progress",
    desc: "A hand-gesture-driven heart visualization built in TouchDesigner with MediaPipe tracking — an astrophage particle system, holographic media panels, and a helmet overlay effect.",
    stack: ["TouchDesigner", "MediaPipe", "Python", "RTX 5070"], link: "#" },
  { featured: true, icon: Printer, title: "Ricoh Printer Automation", tag: "Automation · Shipped",
    desc: "A Python + Playwright tool that scrapes usage stats across 25 printers, handling three distinct authentication types, with a GUI launcher and an automated SharePoint documentation workflow.",
    stack: ["Python", "Playwright", "GUI", "SharePoint"], link: "#" },
  { featured: false, icon: QrCode, title: "QR Support Ticket System", tag: "Internal Tool",
    desc: "A QR-code ticketing flow for library computers using LibAnswers / Springshare, with URL-parameter pre-fill so users land on a context-aware support form.",
    stack: ["LibAnswers", "URL params"], link: "#" },
  { featured: false, icon: Dices, title: "Monty Hall Simulator", tag: "Learning Project",
    desc: "An interactive React simulator that runs the Monty Hall problem thousands of times to make the counterintuitive probability tangible.",
    stack: ["React", "Probability"], link: "#" },
];

const EXPERIENCE: Experience[] = [
  { role: "Senior System Support Analyst", org: "Queen's University", place: "Kingston, ON", period: "Current",
    points: ["Support enterprise IT across Microsoft 365, hybrid Active Directory, and endpoint management.",
             "Build internal automation tools (Python/Playwright) to remove repetitive operational work."] },
  { role: "Senior Technical Support Advisor II", org: "Concentrix", place: "Belleville, ON", period: "Prior",
    points: ["Supported BILL.com and payment-platform integrations for business customers.",
             "Resolved complex account, sync, and API-related issues across financial software."] },
];

const SKILLS: SkillGroup[] = [
  { label: "Enterprise IT & Support", icon: Server,
    items: ["Microsoft 365", "Azure AD", "Active Directory (Hybrid)", "Endpoint / Intune", "Zendesk", "Jira", "Splunk", "ITSM (Atlassian)"] },
  { label: "Automation & Dev", icon: Code2,
    items: ["Python", "Playwright", "SQL", "React", "Git / GitHub", "REST APIs"] },
  { label: "AI / ML — in progress", icon: Brain,
    items: ["NumPy", "Pandas", "Scikit-learn", "PyTorch", "Transformers", "MLOps"], inProgress: true },
];

const ROADMAP: RoadmapItem[] = [
  { phase: "Phase 1", title: "Foundations", detail: "Python · Linear algebra · Statistics", done: true },
  { phase: "Phase 2", title: "Data Stack", detail: "NumPy · Pandas · Scikit-learn", done: false },
  { phase: "Phase 3", title: "Classic ML", detail: "Models · Feature engineering", done: false },
  { phase: "Phase 4", title: "Deep Learning", detail: "PyTorch · Transformers", done: false },
  { phase: "Phase 5", title: "Production", detail: "MLOps · Deployment · AI infra", done: false },
];

const FUTURE_IDEAS: IdeaItem[] = [
  { icon: Brain, title: "First ML project", note: "A shipped model + write-up to anchor the AI track." },
  { icon: GitBranch, title: "Open-source the printer tool", note: "Polish the automation repo as a GitHub showpiece." },
  { icon: Lock, title: "Privacy Pi", note: "Self-hosted AdGuard + WireGuard build log." },
  { icon: ShoppingBag, title: "Pet Parent Paradise", note: "Shopify side project with AI-generated previews." },
];

const THEME = { bg: "#08080c", panel: "#0e0e16", panel2: "#13131e", border: "#23233a", text: "#e7e7f0", muted: "#9a9ab2" };

const A = "var(--accent)";
const A2 = "var(--accent2)";
const CONTAINER = "w-[90%] md:w-[70%] mx-auto";

/* Brand logos — lucide v1.0 removed brand icons, so these are inline SVGs. */
function GithubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function LinkedinIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ============================================================
   THEMING
   ============================================================ */
const PALETTES: PaletteDef[] = [
  { name: "Cyan / Violet", a: "#22d3ee", b: "#a78bfa" },
  { name: "Emerald / Lime", a: "#34d399", b: "#a3e635" },
  { name: "Amber / Rose", a: "#fbbf24", b: "#fb7185" },
  { name: "Sky / Indigo", a: "#38bdf8", b: "#818cf8" },
  { name: "Magenta / Teal", a: "#e879f9", b: "#2dd4bf" },
];
const AUTO_STOPS: string[] = ["#22d3ee", "#a78bfa", "#fb7185", "#fbbf24", "#34d399", "#22d3ee"];

/* ============================================================
   GLOBAL SHADER BACKGROUND — three.js is lazy-loaded inside the
   effect so the page paints first, then the canvas fades in.
   Performance knobs: RES (render scale), FPS (frame cap).
   ============================================================ */
const RES = 0.66;   // render at 66% resolution; soft clouds hide the upscale → big GPU saving
const FPS = 30;     // frame cap for the background (raise to 45/60 for more fluid clouds)

interface ShaderBackgroundProps {
  reduced: boolean;
  theme: ThemeState;
  rootRef: RefObject<HTMLDivElement | null>;
}

function ShaderBackground({ reduced, theme, rootRef }: ShaderBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ scroll: 0, mx: 0, my: 0 });
  const reducedRef = useRef(reduced);
  const themeRef = useRef<ThemeState>(theme);
  const applyRef = useRef<(() => void) | null>(null);
  useEffect(() => { reducedRef.current = reduced; }, [reduced]);

  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");          // ← lazy-loads three.js AFTER first paint
      if (cancelled || !ref.current) return;

      // auto-theme colour helpers (kept here so they live with three)
      const AUTO = AUTO_STOPS.map((h) => new THREE.Color(h));
      const computeAuto = (t: number, outA: TColor, outB: TColor): void => {
        const seg = AUTO.length - 1;
        t = Math.max(0, Math.min(t, 1));
        const pos = t * seg, i = Math.min(Math.floor(pos), seg - 1);
        outA.lerpColors(AUTO[i], AUTO[i + 1], pos - i);
        const t2 = (t + 0.5) % 1, pos2 = t2 * seg, j = Math.min(Math.floor(pos2), seg - 1);
        outB.lerpColors(AUTO[j], AUTO[j + 1], pos2 - j);
      };

      const renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setPixelRatio(1);
      const sizeW = () => Math.floor(window.innerWidth * RES);
      const sizeH = () => Math.floor(window.innerHeight * RES);
      renderer.setSize(sizeW(), sizeH(), false);
      Object.assign(renderer.domElement.style, {
        width: "100%", height: "100%", display: "block",
        opacity: reducedRef.current ? "1" : "0", transition: "opacity .8s ease",   // fade-in
      });
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      cam.position.z = 1;

      const uniforms = {
        iResolution: { value: new THREE.Vector3(sizeW(), sizeH(), 1) },
        iTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColA: { value: new THREE.Color(PALETTES[0].a) },
        uColB: { value: new THREE.Color(PALETTES[0].b) },
      };

      const FRAG = `
        uniform vec3 iResolution;
        uniform float iTime;
        uniform float uScroll;
        uniform vec2 uMouse;
        uniform vec3 uColA, uColB;
        #define t (iTime*0.5 + uScroll*5.0)
        mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
        float map(vec3 p, mat2 r1, mat2 r2, vec3 sc){
          p.xz *= r1; p.xy *= r2;
          vec3 q = p*2.+t;
          return length(p+sc)*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
        }
        void main(){
          float scale = min(iResolution.x, iResolution.y);
          vec2 uv = (gl_FragCoord.xy - 0.5*iResolution.xy)/scale;
          uv -= uMouse * 0.16;
          vec3 col = mix(uColA, uColB, uScroll);
          vec3 amb = col * 0.40;
          vec3 glow = col * 5.5;
          mat2 r1 = m(t*0.4), r2 = m(t*0.3);
          vec3 sc = vec3(sin(t*0.7));
          vec3 cl = vec3(0.);
          float d = 2.5;
          for(int i=0; i<=5; i++){
            vec3 pos = vec3(0.,0.,5.) + normalize(vec3(uv, -1.))*d;
            float rz = map(pos, r1, r2, sc);
            float f = clamp((rz - map(pos+.1, r1, r2, sc))*0.5, -.1, 1.);
            vec3 l = amb + glow*f;
            cl = cl*l + (1.-smoothstep(0., 2.5, rz))*.7*l;
            d += min(rz, 1.);
          }
          gl_FragColor = vec4(cl, 1.0);
        }`;

      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
        fragmentShader: FRAG,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

      const cur = { scroll: 0, mx: 0, my: 0 };
      const cA = new THREE.Color(), cB = new THREE.Color();

      const resolveColors = (): void => {
        const th = themeRef.current;
        if (th.mode === "auto") computeAuto(cur.scroll, cA, cB);
        else { cA.set(th.a); cB.set(th.b); }
        uniforms.uColA.value.copy(cA);
        uniforms.uColB.value.copy(cB);
        if (rootRef.current) {
          rootRef.current.style.setProperty("--accent", cA.getStyle());
          rootRef.current.style.setProperty("--accent2", cB.getStyle());
        }
      };
      applyRef.current = () => { resolveColors(); renderer.render(scene, cam); };

      const start = performance.now();
      const interval = 1000 / FPS;
      let lastFrame = 0;
      let lastMove = 0;
      let raf = 0;
      resolveColors();
      renderer.render(scene, cam);
      requestAnimationFrame(() => { renderer.domElement.style.opacity = "1"; });   // trigger fade-in

      const loop = (now: number): void => {
        raf = requestAnimationFrame(loop);
        if (reducedRef.current || document.hidden) return;
        if (now - lastFrame < interval) return;
        lastFrame = now;
        const tnow = performance.now();
        if (tnow - lastMove > 1500) {
          target.current.mx = Math.sin(tnow * 0.0003) * 0.45;
          target.current.my = Math.cos(tnow * 0.00025) * 0.32;
        }
        cur.scroll += (target.current.scroll - cur.scroll) * 0.08;
        cur.mx += (target.current.mx - cur.mx) * 0.09;
        cur.my += (target.current.my - cur.my) * 0.09;
        uniforms.iTime.value = (tnow - start) / 1000;
        uniforms.uScroll.value = cur.scroll;
        uniforms.uMouse.value.set(cur.mx, cur.my);
        resolveColors();
        renderer.render(scene, cam);
      };
      raf = requestAnimationFrame(loop);

      const onScroll = (): void => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        target.current.scroll = max > 0 ? Math.min(el.scrollTop / max, 1) : 0;
      };
      const onPointer = (e: PointerEvent): void => {
        if (e.pointerType === "touch") return;
        lastMove = performance.now();
        target.current.mx = (e.clientX / window.innerWidth - 0.5) * 2;
        target.current.my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      const onResize = (): void => {
        renderer.setSize(sizeW(), sizeH(), false);
        uniforms.iResolution.value.set(sizeW(), sizeH(), 1);
        renderer.render(scene, cam);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", onResize);
        mat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
    })();

    return () => { cancelled = true; cleanup(); };
  }, []);

  useEffect(() => { themeRef.current = theme; applyRef.current?.(); }, [theme]);

  return <div ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0 }} />;
}

interface RevealProps { children: ReactNode; delay?: number; }
function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} data-reveal="" style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(24px)",
      transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
    }}>{children}</div>
  );
}

/* ============================================================
   TYPEWRITER NAME — cycles the name through scripts with a live
   cursor: holds, erases, retypes the next language, loops.
   Tune all timing in the TW object below (milliseconds).
   ============================================================ */
const TW = {
  type: 95,        // delay between typed characters
  erase: 38,       // delay between erased characters (faster than typing = natural wipe)
  holdFirst: 2600, // pause on "Jay Gohil" at first load so it reads
  hold: 1500,      // pause on every other script before erasing
  switch: 260,     // beat after erase finishes, before the next script types in
};

const NAME_VARIANTS: string[] = [
  "Jay Gohil",
  "જય ગોહિલ",
  "जय गोहिल",
  "джай гохил",
  "じゃい ごひる",
  "제이 고힐",
  "جاي جوهيل",
  "杰伊·戈希尔",
  "ஜாய் கோஹில்",
  "ᛃᚨᛃ ᚷᛟᚺᛁᛚ",
];

type TwMode = "hold" | "deleting" | "switch" | "typing";

function TypewriterName({ reduced }: { reduced: boolean }) {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(NAME_VARIANTS[0].length);
  const [mode, setMode] = useState<TwMode>("hold");
  const current = NAME_VARIANTS[idx];

  useEffect(() => {
    if (reduced) return;
    let to: ReturnType<typeof setTimeout> | undefined;
    if (mode === "hold") {
      to = setTimeout(() => setMode("deleting"), idx === 0 ? TW.holdFirst : TW.hold);
    } else if (mode === "deleting") {
      if (count > 0) to = setTimeout(() => setCount((c) => c - 1), TW.erase);
      else { setIdx((i) => (i + 1) % NAME_VARIANTS.length); setMode("switch"); }
    } else if (mode === "switch") {
      to = setTimeout(() => setMode("typing"), TW.switch);
    } else {
      if (count < current.length) to = setTimeout(() => setCount((c) => c + 1), TW.type);
      else setMode("hold");
    }
    return () => { if (to) clearTimeout(to); };
  }, [mode, count, idx, reduced, current.length]);

  const shown = reduced ? NAME_VARIANTS[0] : current.slice(0, count);
  const cursorClass =
    "tw-cursor " +
    (mode === "hold" ? "blink" : "solid") +
    (mode === "deleting" ? " del" : "");

  return (
    <h1 aria-label={NAME_VARIANTS[0]}
      className="font-bold tracking-tight leading-tight"
      style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", minHeight: "1.25em", lineHeight: 1.12 }}>
      <span aria-hidden="true">{shown}</span>
      <span aria-hidden="true" className={cursorClass} />
    </h1>
  );
}

const SECTIONS: [string, string][] = [
  ["about", "About"], ["projects", "Projects"], ["experience", "Experience"],
  ["skills", "Skills"], ["roadmap", "Roadmap"], ["contact", "Contact"],
];
const ROW = 44;
const RAIL = SECTIONS.length * ROW;
const N = SECTIONS.length;

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [themeMode, setThemeMode] = useState<number | "auto">(0);
  const [themeOpen, setThemeOpen] = useState(false);
  const [reduced, setReduced] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Chapter progress → --chapter (section + fraction-through-it), aligned to rail rows. No re-render.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const refLine = window.scrollY + window.innerHeight * 0.5;
      const tops = SECTIONS.map(([id]) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
      });
      let chap = 0;
      if (refLine <= tops[0]) chap = 0;
      else if (refLine >= tops[N - 1]) chap = N - 1;
      else {
        for (let i = 0; i < N - 1; i++) {
          if (refLine >= tops[i] && refLine < tops[i + 1]) {
            chap = i + (refLine - tops[i]) / Math.max(tops[i + 1] - tops[i], 1);
            break;
          }
        }
      }
      rootRef.current?.style.setProperty("--chapter", String(chap));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const go = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const featured = PROJECTS.filter((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  const palette: PaletteDef | null = typeof themeMode === "number" ? PALETTES[themeMode] : null;
  const isAuto = palette === null;
  const theme: ThemeState = palette ? { mode: "manual", a: palette.a, b: palette.b } : { mode: "auto" };
  const baseA = palette ? palette.a : AUTO_STOPS[0];
  const baseB = palette ? palette.b : AUTO_STOPS[1];

  const MotionToggle = () => (
    <button onClick={() => setReduced((v) => !v)} className="nav-link inline-flex items-center gap-1.5"
      aria-label={reduced ? "Enable motion" : "Reduce motion"} title={reduced ? "Motion off — tap to enable" : "Motion on — tap to reduce"}
      style={{ color: reduced ? THEME.muted : A, border: `1px solid ${THEME.border}`, borderRadius: 9999, padding: "5px 10px", fontSize: 12 }}>
      {reduced ? <ZapOff size={14} /> : <Zap size={14} />}
      <span className="hidden sm:inline" style={{ fontFamily: "monospace" }}>{reduced ? "motion off" : "motion on"}</span>
    </button>
  );

  const Swatch = ({ a, b, auto }: { a?: string; b?: string; auto?: boolean }) => (
    <span style={{ width: 18, height: 18, borderRadius: 9999, flexShrink: 0,
      background: auto ? "conic-gradient(from 0deg, #22d3ee, #a78bfa, #fb7185, #fbbf24, #34d399, #22d3ee)" : `linear-gradient(135deg, ${a}, ${b})` }} />
  );

  // To use an image logo: put it in /public, then replace <Terminal/> + <span> with:
  //   <img src="/logo.svg" alt="jay.dev" style={{ height: 22 }} />
  const TopLogo = () => (
    <button onClick={() => go("hero")} aria-label="Home" className="hidden lg:flex items-center gap-2 nav-link"
      style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 45, color: THEME.text,
        padding: "6px 16px", borderRadius: 9999, background: "rgba(8,8,12,0.5)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: `1px solid ${THEME.border}` }}>
      <Terminal size={20} style={{ color: A }} />
      <span className="font-semibold tracking-tight" style={{ fontSize: 18 }}>jay.dev</span>
    </button>
  );

  const SideNav = () => (
    <aside className="hidden lg:flex flex-col justify-between"
      style={{ position: "fixed", left: 0, top: 0, height: "100vh", width: "15%", zIndex: 40, padding: "2rem clamp(0.85rem, 1.6vw, 1.75rem)" }}>
      <div aria-hidden="true" />

      <nav style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 5, top: 0, width: 2, height: RAIL, background: THEME.border }} />
        <span style={{ position: "absolute", left: 5, top: 0, width: 2, height: RAIL, background: A, transformOrigin: "top",
          transform: `scaleY(calc((var(--chapter, 0) * ${ROW} + ${ROW / 2}) / ${RAIL}))`, transition: reduced ? "none" : "transform .15s linear" }} />
        <span className="chapter-dot" style={{ position: "absolute", left: 0, top: 0, width: 12, height: 12, borderRadius: 9999,
          background: A, boxShadow: "0 0 12px var(--accent)", transform: `translateY(calc(var(--chapter, 0) * ${ROW}px + ${(ROW - 12) / 2}px))` }} />
        {SECTIONS.map(([id, label], i) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => go(id)} className="chapter relative flex items-center"
              style={{ height: ROW, paddingLeft: 28, width: "100%", background: "none", border: "none", cursor: "pointer" }}>
              <span className="chapter-label inline-flex items-center gap-2"
                style={{ color: isActive ? THEME.text : THEME.muted, fontWeight: isActive ? 600 : 400, fontSize: 14 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: isActive ? A : THEME.muted }}>{`0${i + 1}`}</span>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 items-start" style={{ position: "relative" }}>
        <button onClick={() => setThemeOpen((o) => !o)} className="nav-link inline-flex items-center gap-1.5"
          aria-label="Choose theme" title="Theme color"
          style={{ color: A, border: `1px solid ${THEME.border}`, borderRadius: 9999, padding: "5px 10px", fontSize: 12 }}>
          <Palette size={14} /> <span style={{ fontFamily: "monospace" }}>theme</span>
        </button>
        <MotionToggle />
        {themeOpen && (
          <div style={{ position: "absolute", left: 0, bottom: "calc(100% + 12px)", zIndex: 60, width: 210,
            background: "rgba(14,14,22,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 10, boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)" }}>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: THEME.muted, letterSpacing: 1, padding: "2px 8px 6px" }}>THEME COLOR</p>
            {PALETTES.map((p, i) => (
              <button key={p.name} className="theme-item" onClick={() => { setThemeMode(i); setThemeOpen(false); }}>
                <Swatch a={p.a} b={p.b} /><span style={{ flex: 1 }}>{p.name}</span>
                {themeMode === i && <Check size={15} style={{ color: A }} />}
              </button>
            ))}
            <div style={{ height: 1, background: THEME.border, margin: "6px 4px" }} />
            <button className="theme-item" onClick={() => { setThemeMode("auto"); setThemeOpen(false); }}>
              <Swatch auto /><span style={{ flex: 1 }}>Auto <span style={{ color: THEME.muted, fontSize: 11 }}>(scroll)</span></span>
              {isAuto && <Check size={15} style={{ color: A }} />}
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div ref={rootRef} className={reduced ? "reduce" : ""}
      style={{ color: THEME.text, minHeight: "100vh", position: "relative", background: "transparent", "--accent": baseA, "--accent2": baseB, "--chapter": 0 } as CSSProperties}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .gtext { background:linear-gradient(90deg, var(--accent), var(--accent2), var(--accent));
          background-size:200% auto; -webkit-background-clip:text; background-clip:text; color:transparent; animation:shimmer 6s linear infinite; }
        .cursor { display:inline-block; width:9px; height:1.05em; margin-left:3px; transform:translateY(2px); background:var(--accent); animation:blink 1.1s step-end infinite; }
        .card { background:rgba(14,14,22,0.55); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          border:1px solid rgba(120,130,170,0.18); border-radius:18px; transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .card:hover { transform:translateY(-5px); border-color:var(--accent);
          box-shadow:0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent), 0 18px 50px -20px color-mix(in srgb, var(--accent) 45%, transparent); }
        .chip { background:rgba(19,19,30,0.6); border:1px solid ${THEME.border}; color:${THEME.muted}; border-radius:9999px; padding:4px 12px; font-size:12px; }
        .nav-link { color:${THEME.muted}; cursor:pointer; transition:color .2s ease; background:none; border:none; }
        .nav-link:hover { color:${THEME.text}; }
        .btn-primary { background:linear-gradient(90deg, var(--accent), var(--accent2)); color:#06060a; font-weight:600; border:none; cursor:pointer; transition:transform .2s ease, box-shadow .2s ease; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 30px -10px color-mix(in srgb, var(--accent2) 65%, transparent); }
        .btn-ghost { border:1px solid rgba(120,130,170,0.3); color:${THEME.text}; background:rgba(14,14,22,0.4); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); cursor:pointer; transition:border-color .2s ease, color .2s ease; }
        .btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
        .icon-link { color:${THEME.muted}; transition:color .2s ease, transform .2s ease; }
        .icon-link:hover { color:var(--accent); transform:translateY(-2px); }
        .dot-on { background:var(--accent); box-shadow:0 0 12px var(--accent); }
        .theme-item { display:flex; align-items:center; gap:10px; width:100%; padding:8px; border:none; background:none; cursor:pointer; color:${THEME.text}; border-radius:10px; font-size:13px; text-align:left; transition:background .15s ease; }
        .theme-item:hover { background:rgba(120,130,170,0.12); }
        a { text-decoration:none; }
        .reduce [data-reveal]{ opacity:1 !important; transform:none !important; transition:none !important; }
        .reduce .gtext{ animation:none !important; }
        .reduce .cursor{ animation:none !important; opacity:1 !important; }
        .reduce .card:hover{ transform:none; }
        .chapter-label{ transition: color .2s ease, transform .2s ease; }
        .chapter:hover .chapter-label{ color:${THEME.text}; transform:translateX(4px); }
        .chapter-dot{ transition: transform .15s linear, box-shadow .3s ease; }
        .reduce .chapter-dot{ transition: box-shadow .3s ease !important; }

        /* ---- multilingual typewriter name ---- */
        .tw-cursor { display:inline-block; width:0.09em; min-width:3px; height:0.86em; margin-left:0.14em;
          vertical-align:-0.04em; border-radius:3px; background:var(--accent);
          box-shadow:0 0 20px var(--accent), 0 0 6px var(--accent);
          transition: background .25s ease, width .18s ease, box-shadow .25s ease; }
        .tw-cursor.blink { animation: blink 1.05s step-end infinite; }
        .tw-cursor.solid { width:0.42ch; animation: tw-pulse 1s ease-in-out infinite; }
        .tw-cursor.del   { background:var(--accent2); box-shadow:0 0 20px var(--accent2), 0 0 6px var(--accent2); }
        @keyframes tw-pulse { 0%,100%{ transform:scaleY(1); filter:brightness(1); }
                              50%   { transform:scaleY(1.14); filter:brightness(1.4); } }
        .reduce .tw-cursor { animation:none !important; opacity:1 !important; }
      `}</style>

      <ShaderBackground reduced={reduced} theme={theme} rootRef={rootRef} />
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", background: "rgba(8,8,12,0.55)" }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <TopLogo />
        <SideNav />
        {/* NAV (mobile/tablet) — hidden on large screens where the left rail takes over */}
        <nav className="lg:hidden" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,12,0.55)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${THEME.border}` }}>
          <div className={`${CONTAINER} flex items-center justify-between py-4`}>
            <button onClick={() => go("hero")} className="flex items-center gap-2 nav-link" style={{ color: THEME.text }}>
              <Terminal size={18} style={{ color: A }} />
              <span className="font-semibold tracking-tight">jay.dev</span>
            </button>
            <div className="flex items-center gap-2" style={{ position: "relative" }}>
              <button onClick={() => setThemeOpen((o) => !o)} className="nav-link inline-flex items-center gap-1.5"
                aria-label="Choose theme" title="Theme color"
                style={{ color: A, border: `1px solid ${THEME.border}`, borderRadius: 9999, padding: "5px 10px", fontSize: 12 }}>
                <Palette size={14} />
                <span className="hidden sm:inline" style={{ fontFamily: "monospace" }}>theme</span>
              </button>
              <MotionToggle />
              <button className="nav-link" onClick={() => setMenuOpen((v) => !v)} style={{ color: THEME.text }}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {themeOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 12px)", zIndex: 60, width: 210,
                  background: "rgba(14,14,22,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                  border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 10, boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)" }}>
                  <p style={{ fontFamily: "monospace", fontSize: 11, color: THEME.muted, letterSpacing: 1, padding: "2px 8px 6px" }}>THEME COLOR</p>
                  {PALETTES.map((p, i) => (
                    <button key={p.name} className="theme-item" onClick={() => { setThemeMode(i); setThemeOpen(false); }}>
                      <Swatch a={p.a} b={p.b} /><span style={{ flex: 1 }}>{p.name}</span>
                      {themeMode === i && <Check size={15} style={{ color: A }} />}
                    </button>
                  ))}
                  <div style={{ height: 1, background: THEME.border, margin: "6px 4px" }} />
                  <button className="theme-item" onClick={() => { setThemeMode("auto"); setThemeOpen(false); }}>
                    <Swatch auto /><span style={{ flex: 1 }}>Auto <span style={{ color: THEME.muted, fontSize: 11 }}>(scroll)</span></span>
                    {isAuto && <Check size={15} style={{ color: A }} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {menuOpen && (
          <div className="lg:hidden" style={{ background: "rgba(14,14,22,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${THEME.border}` }}>
            <div className={`${CONTAINER} flex flex-col py-4 gap-4`}>
              {SECTIONS.map(([id, label]) => (
                <button key={id} onClick={() => go(id)} className="nav-link text-left"
                  style={{ color: active === id ? A : THEME.muted }}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* HERO */}
        <header id="hero" className="relative overflow-hidden">
          <div className={`${CONTAINER} pt-20 pb-24 md:pt-28 md:pb-32`}>
            <div className="grid lg:grid-cols-5 gap-10 lg:items-center">
              <div className="lg:col-span-3">
                <Reveal>
                  <div className="inline-flex items-center gap-2 mb-6 chip" style={{ color: A }}>
                    <span className="block rounded-full dot-on" style={{ width: 7, height: 7 }} />
                    <span style={{ fontFamily: "monospace" }}>open to work</span>
                  </div>
                </Reveal>
                <Reveal delay={80}>
                  <TypewriterName reduced={reduced} />
                </Reveal>
                <Reveal delay={160}>
                  <p className="mt-3 font-semibold" style={{ fontSize: "clamp(1.1rem, 3vw, 1.7rem)" }}>
                    <span className="gtext">{PROFILE.tagline}</span>
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <p className="mt-6 max-w-2xl leading-relaxed" style={{ color: "#cfd0e0", fontSize: "1.05rem" }}>{PROFILE.blurb}</p>
                </Reveal>
                <Reveal delay={320}>
                  <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: THEME.muted }}>
                    <MapPin size={15} style={{ color: A }} /> {PROFILE.location}
                  </div>
                </Reveal>
                <Reveal delay={400}>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a href={PROFILE.links.email} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm"><Mail size={16} /> Get in touch</a>
                    <a href={PROFILE.links.resume} className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm"><FileText size={16} /> Resume</a>
                    <a href={PROFILE.links.github} className="icon-link p-2"><GithubIcon size={20} /></a>
                    <a href={PROFILE.links.linkedin} className="icon-link p-2"><LinkedinIcon size={20} /></a>
                  </div>
                </Reveal>
              </div>

              <div className="card p-6 hidden lg:block lg:col-span-2">
                <p style={{ fontFamily: "monospace", fontSize: 12, color: A, letterSpacing: 1 }}>// snapshot</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt style={{ color: THEME.muted }}>Status</dt>
                    <dd className="inline-flex items-center gap-2"><span className="block rounded-full dot-on" style={{ width: 7, height: 7 }} /> Open to work</dd>
                  </div>
                  {SNAPSHOT.map(([k, v], i) => (
                    <div key={k} className="flex items-center justify-between gap-3">
                      <dt style={{ color: THEME.muted }}>{k}</dt>
                      <dd style={i === SNAPSHOT.length - 1 ? { color: A2 } : undefined}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div style={{ height: 1, background: THEME.border, margin: "16px 0" }} />
                <div className="flex flex-wrap gap-2">
                  {SNAPSHOT_STACK.map((s) => (<span key={s} className="chip">{s}</span>))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ABOUT */}
        <Section id="about" label="01 / About" title="The two-track engineer">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-6">
                <Server size={22} style={{ color: A }} />
                <h3 className="mt-3 font-semibold text-lg">Today: Systems & Support</h3>
                <p className="mt-2 leading-relaxed" style={{ color: THEME.muted }}>Half a decade keeping enterprise environments stable and secure — M365 administration, hybrid AD, endpoint management — and automating the repetitive parts away with Python.</p>
              </div>
              <div className="card p-6">
                <Brain size={22} style={{ color: A2 }} />
                <h3 className="mt-3 font-semibold text-lg">Tomorrow: AI / ML</h3>
                <p className="mt-2 leading-relaxed" style={{ color: THEME.muted }}>Working through a structured roadmap from Python foundations to deep learning and MLOps, applying engineering discipline from real systems to real models.</p>
              </div>
            </div>
          </Reveal>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" label="02 / Projects" title="Things I've built">
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((p, i) => (<Reveal key={p.title} delay={i * 90}><ProjectCard p={p} big /></Reveal>))}
          </div>
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            {others.map((p, i) => (<Reveal key={p.title} delay={i * 90}><ProjectCard p={p} /></Reveal>))}
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section id="experience" label="03 / Experience" title="Where I've worked">
          <div className="grid md:grid-cols-2 gap-5">
            {EXPERIENCE.map((e, i) => (
              <Reveal key={e.org} delay={i * 90}>
                <div className="card p-6 h-full">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-lg">{e.role}</h3>
                    <span className="chip" style={{ color: A }}>{e.period}</span>
                  </div>
                  <p className="mt-1" style={{ color: A }}>{e.org} · <span style={{ color: THEME.muted }}>{e.place}</span></p>
                  <ul className="mt-3 space-y-2">
                    {e.points.map((pt, j) => (<li key={j} className="flex gap-2 leading-relaxed" style={{ color: THEME.muted }}><span style={{ color: A2 }}>▹</span> {pt}</li>))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" label="04 / Skills" title="The toolkit">
          <div className="grid md:grid-cols-3 gap-5">
            {SKILLS.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.label} delay={i * 90}>
                  <div className="card p-6 h-full">
                    <div className="flex items-center gap-2">
                      <Icon size={20} style={{ color: g.inProgress ? A2 : A }} />
                      <h3 className="font-semibold">{g.label}</h3>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {g.items.map((it) => (<span key={it} className="chip" style={g.inProgress ? { borderColor: A2, color: A2 } : undefined}>{it}</span>))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>

        {/* ROADMAP + FUTURE IDEAS */}
        <Section id="roadmap" label="05 / What's Next" title="The AI/ML roadmap">
          <Reveal>
            <div className="card p-6 md:p-8">
              {ROADMAP.map((r, i) => (
                <div key={r.phase} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="rounded-full" style={{ width: 14, height: 14, background: r.done ? A : THEME.panel2, border: `2px solid ${r.done ? "var(--accent)" : THEME.border}`, boxShadow: r.done ? "0 0 12px var(--accent)" : "none" }} />
                    {i < ROADMAP.length - 1 && <span style={{ width: 2, flex: 1, background: THEME.border, marginTop: 4 }} />}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: r.done ? A : THEME.muted }}>{r.phase}</span>
                      {r.done && <span className="chip" style={{ color: A, fontSize: 11 }}>in progress</span>}
                    </div>
                    <h4 className="font-semibold mt-0.5">{r.title}</h4>
                    <p style={{ color: THEME.muted, fontSize: 14 }}>{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 flex items-center gap-2">
            <Rocket size={18} style={{ color: A2 }} />
            <h3 className="font-semibold text-lg">Ideas parked for future builds</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {FUTURE_IDEAS.map((idea, i) => {
              const Icon = idea.icon;
              return (
                <Reveal key={idea.title} delay={i * 70}>
                  <div className="card p-5 flex gap-3 h-full">
                    <Icon size={20} style={{ color: A, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <h4 className="font-medium">{idea.title}</h4>
                      <p style={{ color: THEME.muted, fontSize: 14 }}>{idea.note}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" label="06 / Contact" title="Let's build something">
          <Reveal>
            <div className="card p-8 md:p-10 text-center">
              <Sparkles size={28} style={{ color: A2, margin: "0 auto" }} />
              <h3 className="mt-4 font-bold" style={{ fontSize: "clamp(1.4rem,4vw,2rem)" }}>Open to <span className="gtext">IT & engineering roles</span> across Canada</h3>
              <p className="mt-3 max-w-lg mx-auto" style={{ color: THEME.muted }}>Whether it's systems support today or ML work down the line — if it's interesting, I want to hear about it.</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a href={PROFILE.links.email} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><Mail size={16} /> Email me <ArrowUpRight size={15} /></a>
                <a href={PROFILE.links.linkedin} className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><LinkedinIcon size={16} /> LinkedIn</a>
              </div>
            </div>
          </Reveal>
        </Section>

        <footer className="py-10" style={{ color: THEME.muted, fontSize: 13 }}>
          <div className={`${CONTAINER} text-center`}>
            <span style={{ fontFamily: "monospace" }}>built by {PROFILE.name.toLowerCase()} · © {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface SectionProps { id: string; label: string; title: string; children: ReactNode; }
function Section({ id, label, title, children }: SectionProps) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className={CONTAINER}>
        <Reveal>
          <p style={{ fontFamily: "monospace", fontSize: 13, color: A, letterSpacing: 1 }}>{label}</p>
          <h2 className="font-bold tracking-tight mt-2 mb-8" style={{ fontSize: "clamp(1.7rem,5vw,2.6rem)" }}>{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

interface ProjectCardProps { p: Project; big?: boolean; }
function ProjectCard({ p, big = false }: ProjectCardProps) {
  const Icon = p.icon;
  return (
    <a href={p.link} className="card p-6 block h-full">
      <div className="flex items-start justify-between">
        <div className="rounded-xl p-2.5" style={{ background: "rgba(19,19,30,0.6)", border: `1px solid ${THEME.border}` }}>
          <Icon size={big ? 24 : 20} style={{ color: A }} />
        </div>
        <ArrowUpRight size={18} style={{ color: THEME.muted }} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <h3 className={`font-semibold ${big ? "text-xl" : "text-lg"}`}>{p.title}</h3>
      </div>
      <p style={{ fontFamily: "monospace", fontSize: 12, color: A2 }}>{p.tag}</p>
      <p className="mt-3 leading-relaxed" style={{ color: THEME.muted, fontSize: 14.5 }}>{p.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
      </div>
    </a>
  );
}