'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../src/components/layout/Header';
import { Footer } from '../../src/components/layout/Footer';
import { Button } from '../../src/components/ui/Button';
import { 
  ChevronDownIcon, 
  QuoteIcon, 
  HubSpotIcon, 
  DropboxIcon, 
  SquareIcon, 
  IntercomIcon, 
  GrammarlyIcon 
} from '../../src/components/ui/Icon';

const Section: React.FC<{id?: string, className?: string, children: React.ReactNode}> = ({id, className, children}) => (
    <section id={id} className={`py-20 sm:py-28 ${className || ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{ badge?: string, title: string, subtitle: string, isDark?: boolean }> = ({ badge, title, subtitle, isDark = false }) => (
     <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
        {badge && <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${isDark ? 'bg-neutral-surface-dark text-primary-light' : 'bg-primary-light text-primary-dark'}`}>{badge}</span>}
        <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-neutral-text-primary-light'}`}>{title}</h2>
        <p className={`mt-4 text-lg ${isDark ? 'text-neutral-text-secondary-dark' : 'text-neutral-gray'}`}>{subtitle}</p>
    </div>
);

const FaqItem: React.FC<{ q: string, a: string, isOpen: boolean, onClick: () => void }> = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-neutral-border-light py-6">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left space-x-4">
            <h3 className="text-lg font-semibold text-neutral-text-primary-light">{q}</h3>
            <ChevronDownIcon className={`w-6 h-6 text-primary-blue transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <p className="text-neutral-gray">{a}</p>
            </div>
        </div>
    </div>
);

const MockUI: React.FC<{className?: string}> = ({className}) => (
  <div className={`rounded-lg border border-neutral-border-light bg-white p-4 space-y-3 ${className}`}>
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 rounded-full bg-neutral-border-light"></div>
      <div className="h-4 flex-grow rounded bg-neutral-border-light"></div>
    </div>
    <div className="h-16 rounded bg-neutral-bg-light border border-neutral-border-light/50"></div>
    <div className="flex space-x-3">
      <div className="h-8 flex-grow rounded bg-neutral-bg-light border border-neutral-border-light/50"></div>
      <div className="h-8 w-16 rounded bg-primary-blue/80"></div>
    </div>
  </div>
);


export default function HomePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    // Handle hash anchors when page loads or hash changes
    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    const element = document.querySelector(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    const faqData = [
      { q: "Is trakaply really free?", a: "Yes! trakaply offers a generous free forever plan with unlimited applications, AI extraction, and all core features. Premium plans with advanced analytics coming soon." },
      { q: "What AI providers do you support?", a: "trakaply integrates with Google Gemini for intelligent data extraction from job postings and resumes." },
      { q: "Is my data secure?", a: "Absolutely. We use bank-level encryption, secure cloud storage, and never share your data with third parties. Your job search is private." },
      { q: "Can I export my data?", a: "Absolutely. Export all your applications to CSV anytime. Your data is always yours." },
    ];

  return (
    <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark overflow-x-hidden">
      <Header variant="landing" />

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
             <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0"></div>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center animate-on-scroll relative z-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-neutral-text-primary-light relative z-10">
                       One tool to <span className="text-highlight">manage</span> your job applications and team
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-neutral-gray relative z-10">
                        trakaply helps you work faster, smarter, and more efficiently, delivering the visibility and data-driven insights to mitigate risk and ensure compliance.
                    </p>
                    <div className="mt-8 flex justify-center gap-4 relative z-10">
                        <Link href="/auth">
                          <Button size="large">Get Started Free</Button>
                        </Link>
                        <Button as="a" href="#features" size="large" variant="secondary">See How It Works</Button>
                    </div>
                </div>
                {/* Floating Avatars */}
                <img src="https://avatar.vercel.sh/nina" alt="User avatar" className="absolute top-1/4 left-4 sm:left-12 w-16 h-16 rounded-full shadow-lg animate-on-scroll z-0" style={{animationDelay: '0.4s'}} />
                <img src="https://avatar.vercel.sh/jane" alt="User avatar" className="absolute top-2/3 right-4 sm:right-12 w-20 h-20 rounded-full shadow-lg animate-on-scroll z-0" style={{animationDelay: '0.6s'}} />
                <img src="https://avatar.vercel.sh/omar" alt="User avatar" className="absolute bottom-1/4 left-1/2 -translate-x-32 w-12 h-12 rounded-full shadow-lg animate-on-scroll z-0" style={{animationDelay: '0.8s'}} />
             </div>
             <style>{`.bg-grid-slate-100 { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e2e8f0'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"); }`}</style>
        </section>

        {/* Client Logos Section */}
        <Section className="py-12">
            <div className="animate-on-scroll">
                <p className="text-center text-sm font-semibold text-neutral-gray">MORE THAN 10,000+ JOB SEEKERS TRUST TRAKAPLY</p>
                <div className="mt-6 flex justify-center items-center flex-wrap gap-x-8 gap-y-4 text-neutral-gray">
                    <HubSpotIcon className="h-7" />
                    <DropboxIcon className="h-7" />
                    <SquareIcon className="h-7" />
                    <IntercomIcon className="h-7" />
                    <GrammarlyIcon className="h-7" />
                </div>
            </div>
        </Section>
        
        {/* Features Section */}
        <Section id="features">
            <SectionTitle badge="Features" title="Latest advanced technologies to ensure everything you need" subtitle="Maximize your team's productivity and streamline your workflow with our affordable, user-friendly application management system." />
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="animate-on-scroll">
                    <h3 className="text-2xl font-bold">Dynamic dashboard</h3>
                    <p className="mt-2 text-neutral-gray">trakaply helps you work faster, smarter and more efficiently, delivering data-driven insights to mitigate risk and ensure compliance.</p>
                     <Button variant="secondary" className="mt-6">Explore all</Button>
                </div>
                <div className="animate-on-scroll" style={{animationDelay: '0.2s'}}>
                    <MockUI className="shadow-lg" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center mt-16">
                 <div className="animate-on-scroll md:order-2">
                    <h3 className="text-2xl font-bold">Smart notifications</h3>
                    <p className="mt-2 text-neutral-gray">Easily accessible from the notifications center, calendar or email with the relevant activities.</p>
                </div>
                <div className="animate-on-scroll md:order-1" style={{animationDelay: '0.2s'}}>
                    <MockUI className="shadow-lg" />
                </div>
            </div>
        </Section>

        {/* Integrations Section */}
        <Section id="integrations" className="bg-neutral-surface-dark">
             <SectionTitle badge="Integrations" title="Don't replace. Integrate." subtitle="We understand the hassle of replacing the long used tools in your process. That's why we integrate tools you use in your day-to-day work." isDark />
             <div className="max-w-4xl mx-auto grid grid-cols-4 md:grid-cols-6 gap-4 animate-on-scroll">
                 {Array.from({length: 12}).map((_, i) => (
                     <div key={i} className="aspect-square bg-neutral-bg-dark rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-border-dark"></div>
                     </div>
                 ))}
             </div>
        </Section>

        {/* Testimonial Section */}
        <Section id="testimonials">
            <div className="max-w-4xl mx-auto text-center animate-on-scroll">
                <QuoteIcon className="w-12 h-12 mx-auto text-primary-blue/30" />
                <p className="mt-4 text-2xl md:text-3xl font-medium text-neutral-text-primary-light">
                    "trakaply is helping our company to decrease operational expenses and turnaround time, while increasing the compliance, resource allocation and effectiveness of our contract management."
                </p>
                <div className="mt-8 flex items-center justify-center">
                    <img src="https://avatar.vercel.sh/darlene" alt="Darlene Robertson" className="w-14 h-14 rounded-full" />
                    <div className="ml-4 text-left">
                        <p className="font-bold">Darlene Robertson</p>
                        <p className="text-neutral-gray">Head of Strategy at Vercel</p>
                    </div>
                </div>
            </div>
        </Section>
        
        {/* FAQ Section */}
        <Section id="faq" className="bg-white">
            <SectionTitle title="Frequently Asked Questions" subtitle="Have questions? We have answers. If you can't find what you're looking for, feel free to contact us." />
            <div className="max-w-3xl mx-auto animate-on-scroll">
                {faqData.map((item, index) => (
                    <FaqItem key={index} q={item.q} a={item.a} isOpen={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} />
                ))}
            </div>
        </Section>

        {/* CTA Section */}
        <Section className="bg-neutral-surface-dark">
            <div className="text-center animate-on-scroll">
                 <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Discover the full scale of <span className="text-highlight">trakaply</span> capabilities</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-text-secondary-dark">
                    Join thousands of job seekers who landed their dream jobs with trakaply. Track applications, save time, and stay organized—all for free.
                 </p>
                  <div className="mt-8 flex justify-center">
                    <Link href="/auth">
                      <Button size="large" className="!bg-brand-highlight !text-neutral-bg-dark hover:!bg-brand-highlight/90">Start for Free</Button>
                    </Link>
                </div>
            </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
