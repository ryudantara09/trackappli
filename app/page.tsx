'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqData = [
    { q: "Is trakaply really free?", a: "Yes! trakaply offers a generous free forever plan with unlimited applications, AI extraction, and all core features. Premium plans with advanced analytics coming soon." },
    { q: "What AI providers do you support?", a: "trakaply integrates with Google Gemini for intelligent data extraction from job postings and resumes." },
    { q: "Is my data secure?", a: "Absolutely. We use bank-level encryption, secure cloud storage, and never share your data with third parties. Your job search is private." },
    { q: "Can I export my data?", a: "Absolutely. Export all your applications to CSV anytime. Your data is always yours." },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">trakaply</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">Features</a>
              <a href="#integrations" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">Integrations</a>
              <a href="#faq" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">FAQ</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                One tool to <span className="text-blue-600">manage</span> your job applications and team
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-neutral-600 dark:text-neutral-400">
                trakaply helps you work faster, smarter, and more efficiently, delivering the visibility and data-driven insights to mitigate risk and ensure compliance.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/auth" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                  Get Started Free
                </Link>
                <a href="#features" className="px-8 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium text-lg">
                  See How It Works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400">MORE THAN 10,000+ JOB SEEKERS TRUST TRAKAPLY</p>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">Features</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Latest advanced technologies to ensure everything you need</h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Maximize your team's productivity and streamline your workflow with our affordable, user-friendly application management system.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Dynamic dashboard</h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">trakaply helps you work faster, smarter and more efficiently, delivering data-driven insights to mitigate risk and ensure compliance.</p>
                <Link href="/auth" className="inline-block mt-6 px-6 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium">
                  Explore all
                </Link>
              </div>
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="h-4 flex-grow rounded bg-neutral-200 dark:bg-neutral-800"></div>
                </div>
                <div className="h-16 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"></div>
                <div className="flex space-x-3">
                  <div className="h-8 flex-grow rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"></div>
                  <div className="h-8 w-16 rounded bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section id="integrations" className="py-20 sm:py-28 bg-neutral-900 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 bg-neutral-800 text-blue-400">Integrations</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Don't replace. Integrate.</h2>
              <p className="mt-4 text-lg text-neutral-400">We understand the hassle of replacing the long used tools in your process. That's why we integrate tools you use in your day-to-day work.</p>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-20 sm:py-28 bg-white dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {faqData.map((item, index) => (
                <div key={index} className="border-b border-neutral-200 dark:border-neutral-800 py-6">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left space-x-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                    <svg className={`w-6 h-6 text-blue-600 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-neutral-600 dark:text-neutral-400">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-neutral-900 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Discover the full scale of <span className="text-blue-500">trakaply</span> capabilities</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-400">
                Join thousands of job seekers who landed their dream jobs with trakaply. Track applications, save time, and stay organized—all for free.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/auth" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                  Start for Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-neutral-600 dark:text-neutral-400">
            <p>&copy; 2024 trakaply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
