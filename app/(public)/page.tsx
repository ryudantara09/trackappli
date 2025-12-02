'use client';

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  QuoteIcon,
  HubSpotIcon,
  DropboxIcon,
  SquareIcon,
  IntercomIcon,
  GrammarlyIcon,
  ChevronDownIcon,
} from "@/components/ui/Icon";

// --- Components ---

const SpotlightCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`group relative border border-neutral-border-light dark:border-white/10 bg-white dark:bg-neutral-surface-dark overflow-hidden rounded-3xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(37, 99, 235, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

const BentoCard = ({ title, description, icon, className, delay = 0 }: { title: string, description: string, icon?: React.ReactNode, className?: string, delay?: number }) => (
  <SpotlightCard className={`p-8 ${className}`} delay={delay}>
    <div className="relative z-10 h-full flex flex-col">
      {icon && <div className="mb-6 text-primary-blue">{icon}</div>}
      <h3 className="text-2xl font-bold mb-3 text-neutral-text-primary-light dark:text-white">{title}</h3>
      <p className="text-neutral-gray dark:text-neutral-text-secondary-dark leading-relaxed">{description}</p>
    </div>
  </SpotlightCard>
);

const StatCard = ({ value, label, delay = 0 }: { value: string, label: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="glass-panel rounded-2xl p-6 text-center hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
  >
    <p className="text-4xl font-extrabold text-gradient-primary mb-2">{value}</p>
    <p className="text-sm font-medium text-neutral-gray dark:text-neutral-text-secondary-dark uppercase tracking-wider">{label}</p>
  </motion.div>
);

const TestimonialCard = ({ quote, author, role, avatar, delay = 0 }: { quote: string, author: string, role: string, avatar: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="glass-panel p-8 rounded-3xl relative hover:shadow-xl transition-shadow duration-300"
  >
    <QuoteIcon className="absolute top-8 right-8 w-8 h-8 text-primary-blue/20" />
    <p className="text-lg font-medium text-neutral-text-primary-light dark:text-white mb-6 leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-4">
      <img src={avatar} alt={author} className="w-12 h-12 rounded-full ring-2 ring-primary-blue/20" />
      <div>
        <p className="font-bold text-neutral-text-primary-light dark:text-white">{author}</p>
        <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">{role}</p>
      </div>
    </div>
  </motion.div>
);

const LogoMarquee = () => (
  <div className="w-full overflow-hidden py-12 bg-neutral-bg-light/50 dark:bg-neutral-bg-dark/50 border-y border-neutral-border-light dark:border-white/5">
    <motion.div
      className="flex w-fit"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 40, ease: "linear", repeat: Infinity }}
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-16 px-8 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <HubSpotIcon className="h-8 w-auto" />
          <DropboxIcon className="h-8 w-auto" />
          <SquareIcon className="h-8 w-auto" />
          <IntercomIcon className="h-8 w-auto" />
          <GrammarlyIcon className="h-8 w-auto" />
        </div>
      ))}
    </motion.div>
  </div>
);

const FAQItem = ({ question, answer, delay = 0 }: { question: string, answer: string, delay?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="border-b border-neutral-border-light dark:border-white/10 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-neutral-text-primary-light dark:text-white group-hover:text-primary-blue transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0 text-neutral-gray dark:text-neutral-text-secondary-dark group-hover:text-primary-blue"
        >
          <ChevronDownIcon className="w-5 h-5" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-neutral-gray dark:text-neutral-text-secondary-dark leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
};

const Hero3D = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{
        rotateX: useSpring(rotateX, { stiffness: 150, damping: 20 }),
        rotateY: useSpring(rotateY, { stiffness: 150, damping: 20 }),
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="relative max-w-5xl mx-auto mt-20 perspective-1000 cursor-grab active:cursor-grabbing"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-border-light dark:border-neutral-border-dark bg-white dark:bg-neutral-surface-dark transform-style-3d">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg-light/10 to-transparent pointer-events-none z-20" />
        {/* Mockup Header */}
        <div className="h-12 bg-neutral-bg-light dark:bg-neutral-bg-dark border-b border-neutral-border-light dark:border-neutral-border-dark flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="ml-4 px-3 py-1 rounded-md bg-white dark:bg-neutral-surface-dark text-xs text-neutral-gray w-64 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-blue/20" />
            trakappli.com/dashboard
          </div>
        </div>
        {/* Mockup Content */}
        <div className="p-6 grid grid-cols-12 gap-6 h-[500px] bg-neutral-bg-light/50 dark:bg-neutral-bg-dark/50">
          {/* Sidebar */}
          <div className="col-span-2 hidden md:block space-y-4">
            <div className="h-8 w-3/4 bg-neutral-border-light dark:bg-neutral-border-dark rounded-md animate-pulse" />
            <div className="h-4 w-1/2 bg-neutral-border-light dark:bg-neutral-border-dark rounded-md opacity-50" />
            <div className="h-4 w-2/3 bg-neutral-border-light dark:bg-neutral-border-dark rounded-md opacity-50" />
            <div className="h-4 w-1/2 bg-neutral-border-light dark:bg-neutral-border-dark rounded-md opacity-50" />
          </div>
          {/* Kanban Board */}
          <div className="col-span-12 md:col-span-10 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((col) => (
              <div key={col} className="bg-neutral-bg-light dark:bg-neutral-bg-dark rounded-xl p-4 flex flex-col gap-3">
                <div className="h-6 w-1/2 bg-neutral-border-light dark:bg-neutral-border-dark rounded-md mb-2" />
                {[1, 2].map((card) => (
                  <div key={card} className="bg-white dark:bg-neutral-surface-dark p-3 rounded-lg shadow-sm border border-neutral-border-light dark:border-neutral-border-dark hover:shadow-md transition-shadow">
                    <div className="h-4 w-3/4 bg-neutral-border-light dark:bg-neutral-border-dark rounded-md mb-2" />
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-1/4 bg-primary-blue/20 rounded-md" />
                      <div className="h-6 w-6 rounded-full bg-neutral-border-light dark:bg-neutral-border-dark" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-neutral-bg-light dark:bg-neutral-bg-dark overflow-x-hidden font-sans selection:bg-primary-blue/30">
      <Header variant="landing" />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Animated Background Mesh */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary-blue/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-highlight/10 rounded-full blur-[100px]"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-neutral-border-light dark:border-white/10 mb-8 shadow-sm hover:scale-105 transition-transform cursor-default"
              >
                <span className="w-2 h-2 rounded-full bg-status-offer animate-pulse" />
                <span className="text-sm font-semibold text-neutral-text-primary-light dark:text-white">New: Browser Extension</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-text-primary-light dark:text-white mb-8 leading-[1.1]"
              >
                Land your dream job <br />
                <span className="text-gradient-primary">without the chaos.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-neutral-gray dark:text-neutral-text-secondary-dark mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                The all-in-one workspace for ambitious candidates.<br />Track, optimize, and succeed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  size="large"
                  onClick={() => router.push("/auth")}
                  className="w-full sm:w-auto text-lg px-8 py-4 h-auto shadow-lg shadow-primary-blue/25 hover:shadow-primary-blue/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Start Tracking Free
                </Button>
                <Button
                  variant="secondary"
                  size="large"
                  as="a"
                  href="#features"
                  className="w-full sm:w-auto text-lg px-8 py-4 h-auto glass-panel hover:bg-white/50 dark:hover:bg-white/10"
                >
                  See How It Works
                </Button>
              </motion.div>
            </div>

            {/* 3D Floating Dashboard Mockup */}
            <Hero3D />
          </div>
        </section>

        {/* <LogoMarquee /> */}

        {/* Features Bento Grid */}
        <section id="features" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-4xl font-bold mb-6 text-neutral-text-primary-light dark:text-white">Everything you need to <span className="text-gradient-primary">get hired faster.</span></h2>
              <p className="text-lg text-neutral-gray dark:text-neutral-text-secondary-dark">Stop wrestling with spreadsheets. Trakappli brings your entire job search into one intelligent, collaborative workspace.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(250px,auto)]">
              {/* Large Feature */}
              <BentoCard
                title="Visual Pipeline"
                description="Drag-and-drop Kanban boards that give you instant clarity on where you stand with every application."
                className="bg-gradient-to-br from-white to-neutral-bg-light dark:from-neutral-surface-dark dark:to-neutral-bg-dark"
                icon={<div className="w-12 h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center"><SquareIcon className="w-6 h-6" /></div>}
                delay={0}
              />

              {/* Tall Feature */}
              <BentoCard
                title="Browser Extension"
                description="Save jobs from LinkedIn, Indeed & more with a single click. Automatically extracts job details."
                className="bg-neutral-bg-dark text-white"
                icon={<div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><span className="text-2xl">🧩</span></div>}
                delay={1}
              />

              {/* Standard Features */}
              <BentoCard
                title="Smart Reminders"
                description="Never miss a follow-up. Automated nudges keep you top of mind."
                className="bg-white dark:bg-neutral-surface-dark"
                delay={2}
              />
              <BentoCard
                title="Analytics"
                description="Track your conversion rates and optimize your strategy."
                className="bg-gradient-to-r from-primary-blue/5 to-transparent"
                delay={4}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-neutral-bg-light dark:bg-neutral-bg-dark border-y border-neutral-border-light dark:border-neutral-border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value="60%" label="Faster Sourcing" delay={0} />
              <StatCard value="4x" label="More Callbacks" delay={1} />
              <StatCard value="120k+" label="Jobs Tracked" delay={2} />
              <StatCard value="4.9" label="User Rating" delay={3} />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16 text-neutral-text-primary-light dark:text-white"
            >
              Loved by <span className="text-primary-blue">ambitious people.</span>
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Trakappli simplified my job search completely. I went from a messy spreadsheet to a clear, actionable plan."
                author="Sarah Johnson"
                role="Product Designer"
                avatar="https://avatar.vercel.sh/sarah"
                delay={0}
              />
              <TestimonialCard
                quote="The AI features are a game changer. I tailored my resume for 5 jobs in 10 minutes and got 3 interviews."
                author="Michael Chen"
                role="Software Engineer"
                avatar="https://avatar.vercel.sh/michael"
                delay={1}
              />
              <TestimonialCard
                quote="As a career coach, this is the tool I've been waiting for. It makes tracking student progress effortless."
                author="Alexa Rivera"
                role="Career Coach"
                avatar="https://avatar.vercel.sh/alexa"
                delay={2}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 bg-neutral-bg-light dark:bg-neutral-bg-dark border-t border-neutral-border-light dark:border-neutral-border-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6 text-neutral-text-primary-light dark:text-white">
                Frequently Asked <span className="text-gradient-primary">Questions</span>
              </h2>
              <p className="text-lg text-neutral-gray dark:text-neutral-text-secondary-dark">
                Everything you need to know about Trakappli.
              </p>
            </motion.div>

            <div className="bg-white dark:bg-neutral-surface-dark rounded-3xl p-8 shadow-sm border border-neutral-border-light dark:border-white/5">
              <FAQItem
                question="What makes Trakappli different from a spreadsheet?"
                answer="Spreadsheets are static. Trakappli is an intelligent workspace that actively helps you land a job. We provide automated follow-up reminders, a visual Kanban board for clarity, and a browser extension to save jobs instantly from any site. Plus, our analytics help you understand what's working."
                delay={0}
              />
              <FAQItem
                question="How does the browser extension work?"
                answer="Our browser extension sits quietly in your browser bar. When you find a job you like on LinkedIn, Indeed, or Glassdoor, just click the Trakappli icon. We'll automatically extract key details like the job title, company, and description, saving it to your dashboard in one click."
                delay={1}
              />
              <FAQItem
                question="Is Trakappli free to use?"
                answer="Yes! Trakappli offers a generous free tier that includes unlimited job tracking, the browser extension, and basic analytics. We also offer a Pro plan for power users who want advanced AI features and priority support."
                delay={2}
              />

              <FAQItem
                question="Is my data private and secure?"
                answer="Your privacy is our top priority. Your job search data is yours alone. We do not sell your data to recruiters or third parties. We use industry-standard encryption to keep your information safe and secure."
                delay={4}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-blue" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-blue to-primary-dark opacity-90" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white"
          >
            <h2 className="text-5xl font-extrabold mb-8 tracking-tight">Ready to land your next role?</h2>
            <p className="text-xl text-primary-light mb-12 max-w-2xl mx-auto">Join thousands of job seekers who have accelerated their career with Trakappli.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="large"
                className="!bg-white !text-primary-blue hover:!bg-gray-100 text-lg px-10 py-4 h-auto shadow-xl"
                onClick={() => router.push("/auth")}
              >
                Get Started for Free
              </Button>
              <Button
                variant="secondary"
                size="large"
                className="border-white text-white hover:bg-white/10 text-lg px-10 py-4 h-auto"
                as="a"
                href="/contact"
              >
                Contact Sales
              </Button>
            </div>
            <p className="mt-8 text-sm text-primary-light/80">No credit card required • Cancel anytime</p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}