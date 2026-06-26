import { useEffect, useRef } from "react";
import {
  X, Download, MapPin, Mail, Phone,
  Briefcase, Wrench, Award, FileText,
} from "lucide-react";
import { LinkedinIcon } from "./icons";

/* ============================================================
   RESUME MODAL — native, theme-styled rebuild of the LaTeX CV.
   Opens as a glassmorphism panel: dimmed backdrop fades in,
   the panel scales + slides up, content scrolls internally.
   Close with the X, Esc, or a click on the backdrop.

   Content edited freely below in RESUME.
   The Download button points at /resume.pdf (your LaTeX PDF in /public).
   ============================================================ */

const THEME = { border: "#23233a", text: "#e7e7f0", muted: "#9a9ab2" };
const PDF_PATH = "/JayGohilResume.pdf";
const PDF_NAME = "Jay-Gohil-Resume.pdf";

const RESUME = {
  name: "Jay Gohil",
  title: "Systems & Support Engineer",
  contact: {
    location: "Kingston, ON",
    email: "igohiljay@gmail.com",
    phone: "+1 226 201 5250",
    linkedin: "igohiljay",
    linkedinUrl: "https://www.linkedin.com/in/gohiljay/",
  },
  summary:
    "Technology support and implementation professional with 5+ years of experience supporting Microsoft 365, Active Directory hybrid environments, and enterprise applications in higher-education and SaaS environments. Skilled in business requirements analysis, system implementation, process improvement, and advanced user support. Experienced developing technical documentation, knowledge bases, training materials, and test scenarios to support system adoption and operational efficiency.",
  skills: [
    { label: "Microsoft 365 & Collaboration", items: "Exchange Online · Teams · SharePoint Online · OneDrive for Business · Permissions · Site Administration" },
    { label: "Identity & Security", items: "Active Directory (Hybrid) · Group Policy · Access Provisioning · MFA · Account Lifecycle" },
    { label: "Technology Implementation", items: "System Implementation · Application Configuration · Software Deployment · Business Requirements Analysis · Process Improvement" },
    { label: "Systems Administration", items: "Multi-user Environments · Workstation Imaging · Endpoint Deployment · Backup Support" },
    { label: "Service Operations", items: "Incident Management · Request Fulfillment · Ticket Workflow · SLA Adherence · Advanced User Support" },
    { label: "Training, Testing & Documentation", items: "User Training · Knowledge Base Development · Test Scenarios · SOP/KB Authoring" },
    { label: "Tools & Infrastructure", items: "PowerShell (working knowledge) · Power Automate (exposure) · Meeting Room Technology · Networked Printers" },
  ],
  experience: [
    {
      role: "Sr. System Support Technician (Term)",
      org: "Queen's University Library",
      place: "Kingston, ON",
      period: "Jan 2026 – Present",
      points: [
        "Support implementation, configuration, and rollout of Microsoft 365 services including Exchange Online, SharePoint Online, Teams, and OneDrive.",
        "Perform system onboarding, workstation deployment, and access administration in a Microsoft Active Directory hybrid environment.",
        "Collaborate with faculty departments, administrative staff, and IT teams to identify technology needs and recommend workflow or system improvements.",
        "Provide operational IT support for faculty, staff, and shared academic spaces including teaching podiums and meeting room technology.",
        "Provide guidance and informal training on Microsoft 365 tools to improve user adoption and productivity.",
        "Develop and maintain knowledge base articles and technical documentation to improve support efficiency and user self-service.",
      ],
    },
    {
      role: "Sr. Technical Support Advisor II",
      org: "Concentrix — SaaS / Fintech Client",
      place: "Belleville, ON",
      period: "Oct 2023 – Aug 2025",
      points: [
        "Delivered Tier 1/2 support for enterprise applications and multi-user systems, including OS deployment, software installation, and endpoint configuration.",
        "Managed Active Directory accounts, access provisioning, and permissions following security policies.",
        "Supported Microsoft 365 and SharePoint environments for collaboration and file access.",
        "Troubleshot network connectivity, VPN, DNS, printing, and application issues impacting business operations.",
        "Authored SOPs and knowledge base documentation to improve issue resolution and support consistency.",
      ],
    },
    {
      role: "IT Analyst",
      org: "Direct2Web",
      place: "Remote, India",
      period: "Jul 2019 – Jan 2021",
      points: [
        "Provided user support in a networked enterprise environment including workstation setup and software deployment.",
        "Performed system imaging, hardware diagnostics, and application testing.",
        "Contributed to internal knowledge base documentation for recurring technical issues.",
      ],
    },
  ],
  certifications: [
    "IT Service Management (ITSM) — Atlassian",
    "Software Testing Foundation — LambdaTest (LinkedIn Learning)",
    "Microsoft IT Support — Microsoft",
  ],
};

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  reduced: boolean;
  closeOnBackdrop?: boolean; // default true; set false to require X / Esc only
}

export default function ResumeModal({ open, onClose, reduced, closeOnBackdrop = true }: ResumeModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Résumé"
      onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose(); }}
      className={"rm-backdrop" + (reduced ? " rm-reduced" : "")}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "clamp(12px, 4vh, 48px) clamp(10px, 3vw, 24px)",
        background: "rgba(6,6,11,0.62)",
        backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
      }}
    >
      <style>{`
        @keyframes rm-back-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rm-panel-in {
          from { opacity: 0; transform: translateY(26px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rm-item-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rm-backdrop { animation: rm-back-in .35s ease both; }
        .rm-panel { animation: rm-panel-in .5s cubic-bezier(.2,.8,.2,1) both; }
        .rm-stagger > * { animation: rm-item-in .5s ease both; }
        .rm-stagger > *:nth-child(1){ animation-delay:.10s } .rm-stagger > *:nth-child(2){ animation-delay:.16s }
        .rm-stagger > *:nth-child(3){ animation-delay:.22s } .rm-stagger > *:nth-child(4){ animation-delay:.28s }
        .rm-stagger > *:nth-child(5){ animation-delay:.34s } .rm-stagger > *:nth-child(6){ animation-delay:.40s }
        .rm-stagger > *:nth-child(7){ animation-delay:.46s }

        .rm-reduced .rm-backdrop, .rm-reduced.rm-backdrop { animation: none !important; }
        .rm-reduced .rm-panel, .rm-reduced .rm-stagger > * { animation: none !important; }

        .rm-glass { background: rgba(16,16,26,0.55); backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%); border: 1px solid rgba(120,130,170,0.20); }
        .rm-card { background: rgba(19,19,30,0.45); border: 1px solid rgba(120,130,170,0.16);
          border-radius: 14px; transition: border-color .25s ease, transform .25s ease; }
        .rm-card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .rm-pill { display:inline-block; background: rgba(19,19,30,0.6); border: 1px solid ${THEME.border};
          color: ${THEME.muted}; border-radius: 9999px; padding: 3px 11px; font-size: 12px; }
        .rm-x { color: ${THEME.muted}; background: rgba(19,19,30,0.5); border: 1px solid ${THEME.border};
          border-radius: 9999px; width: 36px; height: 36px; display: grid; place-items: center;
          cursor: pointer; transition: color .2s ease, border-color .2s ease, transform .2s ease; }
        .rm-x:hover { color: var(--accent); border-color: var(--accent); transform: rotate(90deg); }
        .rm-dl { background: linear-gradient(90deg, var(--accent), var(--accent2)); color: #06060a;
          font-weight: 600; border: none; border-radius: 9999px; padding: 9px 16px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; font-size: 14px;
          transition: transform .2s ease, box-shadow .2s ease; }
        .rm-dl:hover { transform: translateY(-2px);
          box-shadow: 0 12px 30px -10px color-mix(in srgb, var(--accent2) 65%, transparent); }
        .rm-dl:active { transform: translateY(1px) scale(0.97); }
        @keyframes rm-dl-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.12); }
          55%  { transform: scale(0.94); }
          75%  { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .rm-dl-bounce { animation: rm-dl-bounce .7s ease both .55s; }
        .rm-reduced .rm-dl-bounce { animation: none !important; }
        .rm-scroll::-webkit-scrollbar { width: 10px; }
        .rm-scroll::-webkit-scrollbar-track { background: transparent; }
        .rm-scroll::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--accent) 45%, transparent);
          border-radius: 9999px; border: 2px solid transparent; background-clip: padding-box; }
        .rm-scroll::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--accent) 70%, transparent); background-clip: padding-box; }
        .rm-scroll { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--accent) 50%, transparent) transparent; }
        .rm-bullet { color: var(--accent2); flex-shrink: 0; }
        .rm-link { color: ${THEME.muted}; display: inline-flex; align-items: center; gap: 6px; transition: color .2s ease; }
        .rm-link:hover { color: var(--accent); }
        .rm-sec-rule { height: 1px; background: linear-gradient(90deg, var(--accent), transparent); opacity: .5; margin-top: 6px; }
      `}</style>

      <div ref={panelRef} className="rm-panel rm-glass rm-scroll"
        style={{
          width: "min(880px, 100%)", maxHeight: "92vh", overflowY: "auto",
          borderRadius: 22, boxShadow: "0 40px 120px -30px rgba(0,0,0,0.8)",
          position: "relative",
        }}>

        {/* sticky glass header inside the panel */}
        <div className="rm-glass" style={{
          position: "sticky", top: 0, zIndex: 5,
          borderLeft: "none", borderRight: "none", borderTop: "none",
          borderTopLeftRadius: 22, borderTopRightRadius: 22,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "14px clamp(16px, 4vw, 28px)",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} style={{ color: "var(--accent)" }} />
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--accent)", letterSpacing: 1 }}>// résumé</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <a href={PDF_PATH} download={PDF_NAME} className="rm-dl rm-dl-bounce">
              <Download size={16} /> <span>Download PDF</span>
            </a>
            <button className="rm-x" onClick={onClose} aria-label="Close résumé"><X size={18} /></button>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: "clamp(20px, 4vw, 36px)" }}>
          {/* name + contact */}
          <div className="rm-stagger">
            <div>
              <h2 style={{ fontWeight: 700, letterSpacing: "-0.02em", margin: 0, fontSize: "clamp(1.8rem, 5vw, 2.6rem)" }}>
                {RESUME.name}
              </h2>
              <p style={{ color: "var(--accent2)", margin: "4px 0 0", fontWeight: 600, fontSize: "1.05rem" }}>
                {RESUME.title}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 12, fontSize: 13.5 }}>
                <span className="rm-link" style={{ cursor: "default" }}><MapPin size={14} style={{ color: "var(--accent)" }} /> {RESUME.contact.location}</span>
                <a className="rm-link" href={`mailto:${RESUME.contact.email}`}><Mail size={14} style={{ color: "var(--accent)" }} /> {RESUME.contact.email}</a>
                <a className="rm-link" href={`tel:${RESUME.contact.phone.replace(/\s/g, "")}`}><Phone size={14} style={{ color: "var(--accent)" }} /> {RESUME.contact.phone}</a>
                  <a className="rm-link" href={RESUME.contact.linkedinUrl} target="_blank" rel="noopener noreferrer"><span style={{ color: "var(--accent)", display: "inline-flex" }}><LinkedinIcon size={14} /></span> {RESUME.contact.linkedin}</a>
              </div>
            </div>

            {/* summary */}
            <section style={{ marginTop: 26 }}>
              <SectionHead icon={FileText} text="Professional Summary" />
              <p style={{ color: THEME.muted, lineHeight: 1.6, marginTop: 12, fontSize: 14.5 }}>{RESUME.summary}</p>
            </section>

            {/* core skills */}
            <section style={{ marginTop: 26 }}>
              <SectionHead icon={Wrench} text="Core Skills" />
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                {RESUME.skills.map((s) => (
                  <div key={s.label} className="rm-card" style={{ padding: "12px 14px" }}>
                    <p style={{ margin: 0, fontWeight: 600, color: THEME.text, fontSize: 14 }}>{s.label}</p>
                    <p style={{ margin: "4px 0 0", color: THEME.muted, fontSize: 13.5, lineHeight: 1.5 }}>{s.items}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* experience */}
            <section style={{ marginTop: 26 }}>
              <SectionHead icon={Briefcase} text="Experience" />
              <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
                {RESUME.experience.map((e) => (
                  <div key={e.org + e.period} className="rm-card" style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 600, fontSize: "1.05rem" }}>{e.role}</h4>
                        <p style={{ margin: "2px 0 0", color: "var(--accent)", fontSize: 14 }}>{e.org}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="rm-pill" style={{ color: "var(--accent)" }}>{e.period}</span>
                        <p style={{ margin: "6px 0 0", color: THEME.muted, fontSize: 12.5 }}>{e.place}</p>
                      </div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 7 }}>
                      {e.points.map((pt, i) => (
                        <li key={i} style={{ display: "flex", gap: 9, color: THEME.muted, fontSize: 14, lineHeight: 1.5 }}>
                          <span className="rm-bullet">▹</span><span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* certifications */}
            <section style={{ marginTop: 26, marginBottom: 4 }}>
              <SectionHead icon={Award} text="Certifications" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {RESUME.certifications.map((c) => (<span key={c} className="rm-pill">{c}</span>))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ icon: Icon, text }: { icon: typeof FileText; text: string }) {
  return (
    <div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
        <Icon size={17} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.01em" }}>{text}</h3>
      </div>
      <div className="rm-sec-rule" />
    </div>
  );
}