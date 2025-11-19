'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { SparklesIcon, BoltIcon, HeartIcon, RocketIcon } from '@/components/ui/Icon';

const Section: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
    <section className={`py-16 ${className || ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const ValueCard: React.FC<{ icon: React.FC<any>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="text-center p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
            <Icon className="w-8 h-8 text-primary-blue" />
        </div>
        <h3 className="text-xl font-bold text-neutral-text-primary-light mb-2">{title}</h3>
        <p className="text-neutral-gray">{description}</p>
    </div>
);

const TeamMember: React.FC<{ name: string, role: string, avatar: string }> = ({ name, role, avatar }) => (
    <div className="text-center">
        <img src={avatar} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg" />
        <h4 className="text-lg font-bold text-neutral-text-primary-light">{name}</h4>
        <p className="text-neutral-gray">{role}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark min-h-screen text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            <Header variant="landing" />
            
            <main className="pt-24">
                {/* Hero Section */}
                <Section className="pt-20 pb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-text-primary-light mb-6">
                        We&apos;re on a mission to make job hunting <span className="text-primary-blue">effortless</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-neutral-gray max-w-3xl mx-auto">
                        trakaply was born from our own frustration with scattered job applications across emails, spreadsheets, and sticky notes. We built the tool we wish we had—simple, powerful, and free.
                    </p>
                </Section>

                {/* Story Section */}
                <Section className="bg-neutral-surface-light dark:bg-neutral-surface-dark">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-text-primary-light mb-4">
                                Our Story
                            </h2>
                            <p className="text-neutral-gray mb-4">
                                In 2024, our founder was deep in a job search, applying to dozens of positions each week. Tracking everything became overwhelming—which companies had replied? Where was each application in the process? When were the follow-ups due?
                            </p>
                            <p className="text-neutral-gray mb-4">
                                After trying various spreadsheets and tools that were either too complex or too basic, we decided to build something better. Something that understands the modern job seeker&apos;s needs.
                            </p>
                            <p className="text-neutral-gray">
                                Today, trakaply helps thousands of job seekers stay organized, reduce stress, and land their dream jobs faster. And we&apos;re just getting started.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-primary-blue to-primary-dark rounded-lg shadow-2xl flex items-center justify-center">
                                <SparklesIcon className="w-24 h-24 text-white/30" />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Values Section */}
                <Section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-text-primary-light mb-4">
                            Our Values
                        </h2>
                        <p className="text-neutral-gray max-w-2xl mx-auto">
                            These core principles guide everything we build and every decision we make.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard 
                            icon={SparklesIcon}
                            title="Simplicity First"
                            description="Job hunting is hard enough. Your tools shouldn't be. We keep things simple and intuitive."
                        />
                        <ValueCard 
                            icon={BoltIcon}
                            title="Speed Matters"
                            description="Every second counts in a competitive job market. We're fast, efficient, and built for productivity."
                        />
                        <ValueCard 
                            icon={HeartIcon}
                            title="User-Centered"
                            description="We build for real job seekers, not corporate recruiters. Your success is our success."
                        />
                        <ValueCard 
                            icon={RocketIcon}
                            title="Always Improving"
                            description="We ship new features every week based on your feedback. Your voice shapes our roadmap."
                        />
                    </div>
                </Section>

                {/* Team Section */}
                <Section className="bg-neutral-surface-light">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-text-primary-light mb-4">
                            Meet the Team
                        </h2>
                        <p className="text-neutral-gray max-w-2xl mx-auto">
                            A small but mighty team of builders, designers, and job search enthusiasts.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-12">
                        <TeamMember name="Sarah Chen" role="Founder & CEO" avatar="https://avatar.vercel.sh/sarah" />
                        <TeamMember name="Marcus Rodriguez" role="Head of Engineering" avatar="https://avatar.vercel.sh/marcus" />
                        <TeamMember name="Emily Watson" role="Lead Designer" avatar="https://avatar.vercel.sh/emily" />
                        <TeamMember name="David Kim" role="Product Manager" avatar="https://avatar.vercel.sh/david" />
                    </div>
                </Section>

                {/* Stats Section */}
                <Section>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-extrabold text-primary-blue mb-2">10,000+</div>
                            <div className="text-neutral-gray font-medium">Active Job Seekers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold text-primary-blue mb-2">500K+</div>
                            <div className="text-neutral-gray font-medium">Applications Tracked</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold text-primary-blue mb-2">2,500+</div>
                            <div className="text-neutral-gray font-medium">Jobs Landed</div>
                        </div>
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="bg-gradient-to-r from-primary-blue to-primary-dark text-white text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Join thousands of successful job seekers
                    </h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Start tracking your applications today and take control of your job search journey.
                    </p>
                    <Link href="/auth">
                        <Button 
                            size="large" 
                            className="!bg-white !text-primary-blue hover:!bg-gray-100"
                        >
                            Get Started Free
                        </Button>
                    </Link>
                </Section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
