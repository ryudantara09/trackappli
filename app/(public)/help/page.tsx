'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, MagnifyingGlassIcon, EnvelopeIcon } from '@/components/ui/Icon';

const Section: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
    <section className={`py-12 ${className || ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
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

const HelpCenterPage: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    const faqData = [
        { 
            category: "Getting Started",
            questions: [
                { q: "How do I create an account?", a: "Click 'Get Started Free' on the homepage or 'Sign Up' in the header. You can sign up with email or use social login with Google or GitHub." },
                { q: "Is trakappli really free?", a: "Yes! trakappli offers a generous free forever plan with unlimited applications, AI extraction, and all core features. Premium plans with advanced analytics are coming soon." },
                { q: "How do I add my first job application?", a: "After logging in, click the 'Add Application' button on your dashboard. Fill in the job details manually, or use our AI feature to extract data from job posting URLs." },
            ]
        },
        { 
            category: "Features & Usage",
            questions: [
                { q: "How does AI data extraction work?", a: "Our AI integration with Google Gemini analyzes job posting URLs and automatically extracts key information like position, company, location, required skills, and job description. Simply paste the URL and let AI do the work!" },
                { q: "Can I track application status changes?", a: "Yes! You can easily update application statuses by dragging and dropping cards between columns in the Kanban view, or by editing the application directly. Status options include Applied, Interview, Offer, Rejected, and Withdrawn." },
                { q: "How do I export my applications?", a: "Click the 'Export' button in your dashboard header to download all your applications as a CSV file. This is useful for backup or importing into other tools." },
                { q: "Can I search and filter my applications?", a: "Absolutely! Use the search bar to find applications by position, company, or skills. You can also filter by status and date range, and sort by various criteria." },
            ]
        },
        { 
            category: "Account & Data",
            questions: [
                { q: "Is my data secure?", a: "Absolutely. We use bank-level encryption, secure cloud storage, and never share your data with third parties. Your job search is completely private." },
                { q: "Can I delete my account?", a: "Yes, you can delete your account at any time from the Settings page. This action is permanent and will remove all your data." },
                { q: "How do I change my email or password?", a: "Go to Settings > Account to update your email address or change your password. You'll need to verify your current password for security." },
            ]
        },
        { 
            category: "Troubleshooting",
            questions: [
                { q: "The AI extraction isn't working. What should I do?", a: "Make sure you're pasting a valid job posting URL. If it still doesn't work, you can always add the information manually. Contact support if the issue persists." },
                { q: "I'm not receiving email notifications. Why?", a: "Check your spam/junk folder first. Then verify your email settings in Settings > Notifications. Make sure notifications are enabled." },
                { q: "My applications aren't saving. Help!", a: "This usually happens due to connectivity issues. Check your internet connection and try again. If the problem persists, clear your browser cache or try a different browser." },
            ]
        }
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send to a backend
        alert('Thank you for reaching out! We\'ll get back to you within 24 hours.');
        setContactForm({ name: '', email: '', message: '' });
    };

    const allQuestions = faqData.flatMap((cat, catIdx) => 
        cat.questions.map((q, qIdx) => ({ ...q, category: cat.category, index: catIdx * 100 + qIdx }))
    );

    const filteredQuestions = searchQuery.trim() 
        ? allQuestions.filter(q => 
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            q.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allQuestions;

    return (
        <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark min-h-screen text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            <Header variant="landing" />
            
            <main className="pt-24">
                {/* Hero Section */}
                <Section className="pt-20 pb-12 text-center bg-gradient-to-b from-primary-light/30 to-transparent">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-text-primary-light mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-lg text-neutral-gray mb-8 max-w-2xl mx-auto">
                        Search our knowledge base or browse categories below
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-neutral-border-light focus:border-primary-blue focus:outline-none text-lg"
                        />
                    </div>
                </Section>

                {/* FAQ Categories */}
                <Section>
                    {searchQuery.trim() ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6">
                                Search Results ({filteredQuestions.length})
                            </h2>
                            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg border border-neutral-border-light dark:border-neutral-border-dark p-6">
                                {filteredQuestions.length > 0 ? (
                                    filteredQuestions.map((item, idx) => (
                                        <FaqItem 
                                            key={item.index} 
                                            q={item.q} 
                                            a={item.a} 
                                            isOpen={openFaq === item.index} 
                                            onClick={() => setOpenFaq(openFaq === item.index ? null : item.index)} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-neutral-gray py-8">
                                        No results found for &quot;{searchQuery}&quot;. Try different keywords or browse categories below.
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        faqData.map((category, catIdx) => (
                            <div key={catIdx} className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-neutral-text-primary-light">
                                    {category.category}
                                </h2>
                                <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg border border-neutral-border-light dark:border-neutral-border-dark p-6">
                                    {category.questions.map((item, qIdx) => {
                                        const index = catIdx * 100 + qIdx;
                                        return (
                                            <FaqItem 
                                                key={index} 
                                                q={item.q} 
                                                a={item.a} 
                                                isOpen={openFaq === index} 
                                                onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </Section>

                {/* Contact Support */}
                <Section className="bg-neutral-surface-light">
                    <div className="text-center mb-8">
                        <EnvelopeIcon className="w-12 h-12 mx-auto text-primary-blue mb-4" />
                        <h2 className="text-3xl font-bold text-neutral-text-primary-light">
                            Still need help?
                        </h2>
                        <p className="text-neutral-gray mt-2">
                            Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you within 24 hours.
                        </p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg border border-neutral-border-light dark:border-neutral-border-dark p-8">
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-text-primary-light mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-neutral-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-text-primary-light mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-neutral-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-medium text-neutral-text-primary-light mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-neutral-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                                placeholder="Describe your issue or question..."
                            />
                        </div>

                        <Button type="submit" size="large" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </Section>
            </main>

            <Footer />
        </div>
    );
};

export default HelpCenterPage;
