'use client';

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  ChevronDownIcon,
  QuoteIcon,
  HubSpotIcon,
  DropboxIcon,
  SquareIcon,
  IntercomIcon,
  GrammarlyIcon,
} from "@/components/ui/Icon";
import type { BlogArticle } from "@/types/frontend.types";

type SectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

const Section = ({ id, className, children }: SectionProps) => (
  <section id={id} className={`py-20 sm:py-28 ${className || ""}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

type SectionTitleProps = {
  badge?: string;
  title: string;
  subtitle: string;
  isDark?: boolean;
};

const SectionTitle = ({ badge, title, subtitle, isDark = false }: SectionTitleProps) => (
  <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
    {badge && (
      <span
        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
          isDark
            ? "bg-neutral-surface-dark text-primary-light"
            : "bg-primary-light text-primary-dark dark:bg-white/10 dark:text-primary-light"
        }`}
      >
        {badge}
      </span>
    )}
    <h2
      className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
        isDark ? "text-white" : "text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
      }`}
    >
      {title}
    </h2>
    <p
      className={`mt-4 text-lg ${
        isDark ? "text-neutral-text-secondary-dark" : "text-neutral-gray dark:text-neutral-text-secondary-dark"
      }`}
    >
      {subtitle}
    </p>
  </div>
);

const trustLogos = [HubSpotIcon, DropboxIcon, SquareIcon, IntercomIcon, GrammarlyIcon];

const journeySteps = [
  {
    title: "Capture every opportunity",
    description: "Clip roles from LinkedIn, Indeed, and niche boards with the Chrome extension or inbox ingestion.",
    stat: "60% faster sourcing",
  },
  {
    title: "Organize like a pro",
    description: "Drag-and-drop Kanban boards, reminders, and interviewer briefs keep the team aligned without spreadsheets.",
    stat: "42% shorter cycles",
  },
  {
    title: "Optimize each submission",
    description: "AI resume tuning, keyword matching, and prep cards give every application a competitive edge.",
    stat: "4× more callbacks",
  },
];

const featureCards = [
  {
    label: "Data Integration",
    body: "Two-way sync with email, calendar, and ATS exports keeps hiring pipelines accurate everywhere.",
  },
  {
    label: "Automation Built-In",
    body: "Auto reminders for follow-ups, offer tracking, and smart nudges keep momentum without nagging.",
  },
  {
    label: "Insightful Analytics",
    body: "Pipeline velocity, interview-to-offer ratios, and top sources surface coachable moments instantly.",
  },
  {
    label: "Works with Everything",
    body: "Chrome, Safari, mobile web, and secure APIs let schools and cohorts go live in minutes.",
  },
];

const solutionTiles = [
  {
    title: "For Schools",
    body: "Give career centers real-time visibility into each student’s pipeline while respecting FERPA-friendly controls.",
  },
  {
    title: "For Coaches",
    body: "Share boards, leave inline feedback, templatize outreach cadences, and run efficient cohorts.",
  },
  {
    title: "For Students",
    body: "Reduce tab chaos, manage dozens of resumes, and never miss a follow-up or networking reminder.",
  },
];

const testimonials = [
  {
    quote:
      "trakappli simplified our digital classroom. Coaches see the same metrics that students do, so feedback is data-backed and engagement is real-time.",
    name: "Sarah Johnson",
    role: "Director of Career Services • TechRoots Bootcamp",
    badge: "TechRoots",
    avatar: "https://avatar.vercel.sh/sarah",
  },
  {
    quote:
      "Our school's data integration means students, coaches, and administrators collaborate inside one secure workspace instead of juggling spreadsheets.",
    name: "Michael Chen",
    role: "Dean of Students • Unity Poly",
    badge: "Unity Poly",
    avatar: "https://avatar.vercel.sh/michael",
  },
  {
    quote:
      "As a student, I know how trakappli translates to results. The AI resume reviews and reminders meant every recruiter touchpoint stayed on track.",
    name: "Alexa Rivera",
    role: "Product Design Fellow • Blend Academy",
    badge: "Blend Academy",
    avatar: "https://avatar.vercel.sh/alexa",
  },
];

const fallbackArticles: BlogArticle[] = [
  {
    id: "q1-2025-job-market-signal-report",
    title: "Q1 2025 Job Market Signal Report",
    summary: "Hybrid hiring and AI-assisted interviews reshape timelines for enterprise roles.",
    slug: "q1-2025-job-market-signal-report",
    content: "",
    publishedAt: "2025-03-12T00:00:00.000Z",
    authorName: "trakappli Editorial",
  },
  {
    id: "collaborative-job-tracking",
    title: "How Career Teams Use Collaborative Trackers",
    summary: "From bootcamps to universities, collaborative job search boards boost placement rates.",
    slug: "collaborative-job-tracking",
    content: "",
    publishedAt: "2025-02-28T00:00:00.000Z",
    authorName: "trakappli Editorial",
  },
  {
    id: "geo-playbook-hr-tech",
    title: "The GEO Playbook for HR Tech",
    summary: "Designing micro-snippets and schema to earn AI Overview citations.",
    slug: "geo-playbook-hr-tech",
    content: "",
    publishedAt: "2025-02-05T00:00:00.000Z",
    authorName: "trakappli Editorial",
  },
];

const comparisonRows = [
  { label: "Live Kanban & Map view", spreadsheet: "Manual formatting", generic: "List-based UI", trakappli: "Interactive boards, cohort view" },
  { label: "AI resume diagnostics", spreadsheet: "Not available", generic: "Basic keyword check", trakappli: "Keyword density & ATS score" },
  { label: "Coach visibility", spreadsheet: "Manual sharing", generic: "None", trakappli: "Real-time dashboards & FERPA-friendly permissions" },
  { label: "Automated reminders", spreadsheet: "Personal calendar", generic: "Email-only nudges", trakappli: "Built-in email/SMS sequences" },
];

const workflowSteps = [
  { title: "Capture every opportunity", detail: "Save jobs from LinkedIn, Indeed, or referrals with the Chrome Extension or forwarding inbox." },
  { title: "Centralize the pipeline", detail: "Move cards through Kanban, timeline, and map views with tags, deadlines, and interview briefs." },
  { title: "Tailor every submission", detail: "Use AI resume optimization, cover letter prompts, and keyword matching to improve response rates." },
  { title: "Coach collaboratively", detail: "Share boards with advisors, leave inline feedback, and export cohort reports without spreadsheets." },
];

const faqData = [
  {
    question: "Is trakappli free for students and individuals?",
    answer:
      "Yes, trakappli offers a Free Forever plan for individuals with unlimited job tracking, the Chrome Extension, and AI resume suggestions. Paid plans unlock coach dashboards, FERPA-ready permissions, and cohort reporting for career teams.",
  },
  {
    question: "Does trakappli work with LinkedIn Easy Apply and other boards?",
    answer:
      "Chrome and email capture links pull details from LinkedIn, Indeed, Wellfound, or referral threads so every application lands in one Kanban board automatically.",
  },
  {
    question: "How secure is the data I store in trakappli?",
    answer:
      "We use SOC2-ready infrastructure, encryption at rest and in transit, role-based access, and regional data centers so universities and enterprises can meet security reviews with confidence.",
  },
  {
    question: "Can coaches collaborate with their cohorts?",
    answer:
      "Absolutely. Coaches can invite learners, leave inline comments, templatize workflows, and export analytics for weekly check-ins without chasing screenshots.",
  },
  {
    question: "What metrics does trakappli track?",
    answer:
      "Pipeline velocity, interview-to-offer ratio, top sources, follow-up discipline, and time-in-stage are calculated automatically to spotlight coaching opportunities.",
  },
];

const SectionDivider = () => (
  <div className="max-w-7xl mx-auto h-px bg-neutral-border-light/80 dark:bg-neutral-border-dark" aria-hidden="true" />
);

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const router = useRouter();
  const [articles, setArticles] = useState<BlogArticle[]>(fallbackArticles);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadArticles = async () => {
      try {
        const response = await fetch("/api/blog?limit=3");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const payload = await response.json();
        if (mounted && Array.isArray(payload?.data) && payload.data.length > 0) {
          setArticles(payload.data);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to load articles", error);
        }
      } finally {
        if (mounted) {
          setArticlesLoading(false);
        }
      }
    };

    loadArticles();
    return () => {
      mounted = false;
    };
  }, []);

  const schemaPayload = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://trakappli.com/#organization",
          name: "trakappli",
          url: "https://trakappli.com",
          sameAs: [
            "https://www.linkedin.com/company/trakappli",
            "https://twitter.com/trakappli",
            "https://github.com/trakappli",
          ],
          contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "hello@trakappli.com" },
          logo: "https://trakappli.com/Logos/trakappli-logo-blue.svg",
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://trakappli.com/#app",
          name: "trakappli Job Tracker",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, iOS, Android",
          audience: {
            "@type": "Audience",
            audienceType: "Career Coaches, Bootcamps, and Job Seekers",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free for individuals. Paid plans available for teams, schools, and advisors.",
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "487" },
          publisher: { "@id": "https://trakappli.com/#organization" },
          applicationSuite: "Job search CRM, AI resume intelligence, coach collaboration",
        },
        {
          "@type": "FAQPage",
          "@id": "https://trakappli.com/#faq",
          mainEntity: faqData.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    }),
    [],
  );

  const handleGetStarted = () => router.push("/auth");

  return (
    <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark overflow-x-hidden">
      <Header variant="landing" />
      <Script id="ld-homepage" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPayload) }} />

      <main className="overflow-x-hidden">
        <section className="relative overflow-hidden bg-hero-grid pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary-light/40 via-transparent to-transparent" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-on-scroll">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-sm font-semibold">
                  Smarter job management
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  The collaborative job tracker & AI resume builder for career teams
                </h1>
                <p className="text-lg text-neutral-gray dark:text-neutral-text-secondary-dark">
                  trakappli is a collaborative job search platform that combines a Kanban application tracker, AI resume optimization, and coach dashboards to help bootcamps, universities, and ambitious candidates reduce time-to-hire.
                </p>
                <ul className="space-y-2 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary-blue" />
                    <p>Evidence-based workflows across sourcing, networking, resumes, and interviews.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary-blue" />
                    <p>Real-time collaboration for cohorts and advisors with granular sharing controls.</p>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button size="large" onClick={handleGetStarted}>
                    Start Tracking Free
                  </Button>
                  <Button as="a" href="#journey" size="large" variant="secondary">
                    Explore the Journey
                  </Button>
                </div>
                <div className="flex flex-wrap gap-6 pt-6 text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
                  <div>
                    <p className="text-2xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">120K+</p>
                    <p>Opportunities tracked each month</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">4.9/5</p>
                    <p>Average G2 & Trustpilot rating</p>
                  </div>
                </div>
              </div>
              <div className="relative animate-on-scroll">
                <div className="rounded-3xl bg-white dark:bg-neutral-surface-dark shadow-2xl p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-primary-blue to-primary-light text-white p-5 space-y-3">
                      <p className="text-sm uppercase tracking-wide opacity-80">Live board snapshot</p>
                      <p className="text-3xl font-extrabold">38</p>
                      <p className="text-sm">Opportunities moving this week.</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-border-light dark:border-neutral-border-dark p-5 space-y-3">
                  <p className="text-sm uppercase tracking-wide text-neutral-gray dark:text-neutral-text-secondary-dark">Collaborators</p>
                      <div className="flex -space-x-3">
                        {["nina", "kai", "omar"].map((name) => (
                          <img key={name} src={`https://avatar.vercel.sh/${name}`} alt={name} className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-neutral-bg-dark" />
                        ))}
                      </div>
                    <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Advisors reviewing two offers.</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary-blue/60 p-5">
                    <p className="text-sm uppercase tracking-wide text-primary-blue">AI Resume Spotlight</p>
                    <p className="mt-3 text-lg font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                      “Tailor summary to highlight product-led growth wins for Figma role.”
                    </p>
                    <p className="mt-2 text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">Confidence 92% • Ready in 14 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section className="py-12 bg-white dark:bg-neutral-surface-dark/40">
          <div className="animate-on-scroll text-center space-y-6">
            <p className="text-sm font-semibold text-neutral-gray dark:text-neutral-text-secondary-dark uppercase tracking-[0.2em]">
              Alumni hired at partner companies
            </p>
            <div className="mt-6 flex justify-center items-center flex-wrap gap-x-8 gap-y-4 text-neutral-gray dark:text-neutral-text-secondary-dark">
              {trustLogos.map((Icon, idx) => (
                <Icon key={idx} className="h-7 w-auto opacity-80" />
              ))}
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-gray dark:text-neutral-text-secondary-dark">
              Outcomes data pulled from 2024 placement reports
            </p>
          </div>
        </Section>

        <Section className="bg-white dark:bg-neutral-surface-dark">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <p className="text-sm font-semibold tracking-[0.3em] text-primary-blue uppercase">Collaboration advantage</p>
              <h3 className="text-3xl font-bold">Built for FERPA-friendly visibility and outcome reporting</h3>
              <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">
                Career coaches and bootcamp directors get instant access to student pipeline visibility, interview prep status, and employer communication history. Shared boards keep advisors in sync without downloading
                spreadsheets or chasing screenshots, while FERPA-friendly permissioning limits who can see sensitive notes.
              </p>
              <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">
                Export cohort-wide outcome reports with one click, segment data by program or campus, and feed placement metrics back into accreditation or ISA partners. Every interaction is structured so that admins can
                prove impact during audits and marketing teams can turn success into stories.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Coach dashboards show time-in-stage, response rates, and offer probability for every learner.",
                "Shared templates standardize outreach cadences while still allowing advisors to personalize feedback.",
                "Role-based access keeps student notes and salary data compliant while enabling cross-campus collaboration.",
              ].map((item) => (
                <div key={item} className="p-5 rounded-2xl border border-neutral-border-light dark:border-neutral-border-dark bg-neutral-bg-light dark:bg-neutral-surface-dark/70">
                  <p className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <SectionTitle
            badge="Workflow"
            title="How trakappli runs every job search"
            subtitle="Define the process once and keep every student, alum, and advisor focused on the same GTM-style playbook."
          />
          <ol className="grid md:grid-cols-2 gap-6">
            {workflowSteps.map((step, idx) => (
              <li
                key={step.title}
                className="relative rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark p-6 bg-white dark:bg-neutral-surface-dark"
              >
                <span className="absolute -top-4 left-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-blue text-white text-lg font-bold">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-neutral-gray dark:text-neutral-text-secondary-dark">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="journey">
          <SectionTitle
            badge="How it works"
            title="A guided journey from first tab to final offer"
            subtitle="Students, job seekers, and coaches connect through a single structured platform—no manual setup, just intelligent orchestration."
          />
          <div className="grid lg:grid-cols-3 gap-8">
            {journeySteps.map((step) => (
              <div key={step.title} className="rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark p-8 bg-white dark:bg-neutral-surface-dark space-y-4 animate-on-scroll">
                <p className="text-sm font-semibold text-primary-blue uppercase tracking-[0.2em]">{step.stat}</p>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">{step.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="features" className="bg-neutral-bg-dark text-white rounded-t-[48px]">
          <SectionTitle
            badge="Why trakappli"
            title="Powering better learning experiences"
            subtitle="All-in-one system built for seamless, adaptive, and connected education journeys."
            isDark
          />
          <div className="grid md:grid-cols-2 gap-6">
            {featureCards.map((card) => (
              <div key={card.label} className="rounded-3xl bg-neutral-surface-dark p-6 border border-white/10 animate-on-scroll">
                <p className="text-sm font-semibold text-primary-light uppercase tracking-[0.25em]">{card.label}</p>
                <p className="mt-3 text-lg text-neutral-text-secondary-dark">{card.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle
            badge="Solutions"
            title="Smart solutions for smarter education"
            subtitle="Empowering schools, coaches, and students through a unified platform that makes learning intelligent and data-driven."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {solutionTiles.map((solution) => (
              <div key={solution.title} className="rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark p-8 bg-white dark:bg-neutral-surface-dark space-y-4">
                <span className="text-sm font-semibold text-primary-blue uppercase tracking-[0.3em]">{solution.title}</span>
                <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">{solution.body}</p>
                <Button as="a" href="/contact" variant="secondary" size="small" className="w-fit">
                  Learn more
                </Button>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <div className="rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark p-8 bg-white dark:bg-neutral-surface-dark animate-on-scroll overflow-x-auto">
            <p className="text-sm font-semibold text-primary-blue uppercase tracking-[0.4em] mb-4">Comparison</p>
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-gray dark:text-neutral-text-secondary-dark uppercase text-xs tracking-[0.3em]">
                <tr>
                  <th className="py-3 pr-8">Capability</th>
                  <th className="py-3 pr-8">Spreadsheets</th>
                  <th className="py-3 pr-8">Generic trackers</th>
                  <th className="py-3">trakappli</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border-light dark:divide-neutral-border-dark">
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td className="py-4 pr-8 font-medium">{row.label}</td>
                    <td className="py-4 pr-8 text-neutral-gray dark:text-neutral-text-secondary-dark">{row.spreadsheet}</td>
                    <td className="py-4 pr-8 text-neutral-gray dark:text-neutral-text-secondary-dark">{row.generic}</td>
                    <td className="py-4 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">{row.trakappli}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <SectionDivider />

        <Section id="testimonials">
          <SectionTitle
            badge="Testimonials"
            title="What our educators say about trakappli"
            subtitle="A single platform for schools, cohorts, and ambitious candidates to operate with confidence."
          />
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <QuoteIcon className="w-12 h-12 mx-auto text-primary-blue/40" />
            <p className="text-2xl md:text-3xl font-medium text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
              {testimonials[testimonialIndex].quote}
            </p>
            <div className="flex items-center justify-center gap-4 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
              <img src={testimonials[testimonialIndex].avatar} alt={testimonials[testimonialIndex].name} className="w-16 h-16 rounded-full" />
              <div className="text-left">
                <p className="font-bold">{testimonials[testimonialIndex].name}</p>
                <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">{testimonials[testimonialIndex].role}</p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Show testimonial ${idx + 1}`}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`h-3 w-8 rounded-full transition ${
                    idx === testimonialIndex ? "bg-primary-blue" : "bg-neutral-border-light dark:bg-neutral-border-dark"
                  }`}
                />
              ))}
            </div>
          </div>
        </Section>

        <SectionDivider />

        <Section>
          <SectionTitle
            badge="Latest Intel"
            title="Fresh insights from the job market"
            subtitle="LLMs reward fresh data. We publish proprietary research and GEO-friendly guides weekly."
          />
          {articlesLoading && (
            <p className="text-center text-sm text-neutral-gray dark:text-neutral-text-secondary-dark mb-4">
              Loading insights...
            </p>
          )}
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((insight) => (
              <article
                key={insight.slug}
                className="rounded-3xl border border-neutral-border-light dark:border-neutral-border-dark p-6 bg-white dark:bg-neutral-surface-dark space-y-3"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-neutral-gray dark:text-neutral-text-secondary-dark">
                  {new Date(insight.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-xl font-semibold">
                  <Link href={`/blog/${insight.slug}`} className="hover:text-primary-blue transition-colors">
                    {insight.title}
                  </Link>
                </h3>
                <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">
                  {insight.summary || "Explore the latest insight from the trakappli team."}
                </p>
                <Button as="a" href={`/blog/${insight.slug}`} variant="secondary" size="small" className="w-fit">
                  Read
                </Button>
              </article>
            ))}
          </div>
        </Section>

        <Section id="faq" className="bg-white dark:bg-neutral-surface-dark/60 rounded-t-[48px]">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Still curious? These concise answers are engineered for search engines and humans alike."
          />
          <div className="max-w-3xl mx-auto animate-on-scroll">
            {faqData.map((item, index) => (
              <div key={item.question} className="border-b border-neutral-border-light dark:border-neutral-border-dark py-6">
                <button onClick={() => setOpenFaq(index === openFaq ? null : index)} className="w-full flex justify-between items-center text-left space-x-4">
                  <h3 className="text-lg font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">{item.question}</h3>
                  <ChevronDownIcon className={`w-6 h-6 text-primary-blue transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? "grid-rows-[1fr] opacity-100 pt-4" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="text-neutral-gray dark:text-neutral-text-secondary-dark">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section className="pb-32 pt-12 bg-primary-blue text-white text-center">
          <div className="flex flex-col items-center gap-6 animate-on-scroll">
            <p className="text-sm uppercase tracking-[0.4em] text-primary-light/80">Ready to coordinate every offer?</p>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight">It starts with smarter tracking.</h2>
            <p className="max-w-2xl text-lg text-primary-light">
              Every interaction helps improve interviews, personalize learning, and enhance classroom collaboration. With every click, trakappli learns how students grow and adapts content in a unique learning path for every mind.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="large" className="!bg-white !text-primary-blue hover:!bg-primary-light" onClick={handleGetStarted}>
                Book a Live Demo
              </Button>
              <Button as="a" href="/contact" size="large" variant="secondary" className="border-white text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}