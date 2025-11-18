'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-text-primary-light mb-4">{title}</h2>
        <div className="text-neutral-gray space-y-4">
            {children}
        </div>
    </div>
);

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark min-h-screen text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            <Header variant="landing" />
            
            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 pt-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-text-primary-light mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-neutral-gray">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg border border-neutral-border-light dark:border-neutral-border-dark p-8 md:p-12">
                        <Section title="1. Acceptance of Terms">
                            <p>
                                Welcome to trakaply! These Terms of Service (&quot;Terms&quot;) govern your access to and use of trakaply&apos;s website, services, and applications (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms.
                            </p>
                            <p>
                                If you do not agree to these Terms, you may not access or use the Service. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
                            </p>
                        </Section>

                        <Section title="2. Description of Service">
                            <p>
                                trakaply is a job application tracking and management platform that helps users organize their job search. Our Service includes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Application tracking and status management</li>
                                <li>AI-powered job data extraction</li>
                                <li>Analytics and insights</li>
                                <li>Data export functionality</li>
                                <li>Profile and resume management</li>
                            </ul>
                        </Section>

                        <Section title="3. User Accounts">
                            <p><strong>Registration:</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>You must create an account to use certain features of the Service</li>
                                <li>You must provide accurate, current, and complete information</li>
                                <li>You must be at least 18 years old to create an account</li>
                                <li>You are responsible for maintaining the confidentiality of your password</li>
                                <li>You are responsible for all activities that occur under your account</li>
                            </ul>
                            
                            <p className="mt-4"><strong>Account Security:</strong></p>
                            <p>
                                You must immediately notify us of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to comply with these security obligations.
                            </p>
                        </Section>

                        <Section title="4. User Content and Conduct">
                            <p><strong>Your Content:</strong></p>
                            <p>
                                You retain all rights to the content you submit to the Service (job applications, notes, resumes, etc.). By submitting content, you grant us a license to use, store, and process it solely to provide the Service to you.
                            </p>
                            
                            <p className="mt-4"><strong>Prohibited Conduct:</strong></p>
                            <p>You agree NOT to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                                <li>Upload viruses, malware, or any harmful code</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Scrape, spider, or crawl the Service</li>
                                <li>Reverse engineer or attempt to extract source code</li>
                                <li>Use the Service to send spam or unsolicited messages</li>
                                <li>Impersonate another person or entity</li>
                                <li>Share your account credentials with others</li>
                            </ul>
                        </Section>

                        <Section title="5. Intellectual Property">
                            <p>
                                The Service, including its original content, features, and functionality, is owned by trakaply and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                            <p>
                                Our trademarks, logos, and service marks may not be used without our prior written permission. All other trademarks are the property of their respective owners.
                            </p>
                        </Section>

                        <Section title="6. AI and Third-Party Services">
                            <p>
                                We use Google Gemini for AI-powered job data extraction. By using this feature, you acknowledge that:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>AI-generated results may not always be 100% accurate</li>
                                <li>You should review and verify all extracted data</li>
                                <li>Job posting URLs may be processed by third-party AI services</li>
                                <li>We are not responsible for errors in AI extraction</li>
                            </ul>
                        </Section>

                        <Section title="7. Free and Paid Services">
                            <p><strong>Free Plan:</strong></p>
                            <p>
                                trakaply offers a free plan with core features at no cost. We reserve the right to modify or discontinue the free plan at any time with reasonable notice.
                            </p>
                            
                            <p className="mt-4"><strong>Premium Plans (Future):</strong></p>
                            <p>
                                We may offer paid premium plans in the future. Pricing, billing terms, refund policies, and feature details will be provided before you subscribe. All fees are non-refundable unless otherwise stated.
                            </p>
                        </Section>

                        <Section title="8. Data and Privacy">
                            <p>
                                Your use of the Service is also governed by our Privacy Policy. We collect, use, and protect your data as described in that policy. You can export or delete your data at any time through your account settings.
                            </p>
                        </Section>

                        <Section title="9. Termination">
                            <p><strong>By You:</strong></p>
                            <p>
                                You may terminate your account at any time through your account settings. Upon termination, your data will be deleted within 30 days.
                            </p>
                            
                            <p className="mt-4"><strong>By Us:</strong></p>
                            <p>
                                We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason at our sole discretion. We will provide notice when possible, except in cases of serious violations.
                            </p>
                        </Section>

                        <Section title="10. Disclaimers and Limitation of Liability">
                            <p><strong>Service &quot;As Is&quot;:</strong></p>
                            <p>
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                            </p>
                            
                            <p className="mt-4"><strong>Limitation of Liability:</strong></p>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRAKAPLY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                            </p>
                            
                            <p className="mt-4"><strong>No Employment Guarantee:</strong></p>
                            <p>
                                trakaply is a tracking tool only. We do not guarantee job placement, interview invitations, or employment outcomes. Your success depends on your own efforts, qualifications, and market conditions.
                            </p>
                        </Section>

                        <Section title="11. Indemnification">
                            <p>
                                You agree to indemnify, defend, and hold harmless trakaply, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or related to your use of the Service or violation of these Terms.
                            </p>
                        </Section>

                        <Section title="12. Dispute Resolution">
                            <p><strong>Governing Law:</strong></p>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                            </p>
                            
                            <p className="mt-4"><strong>Arbitration:</strong></p>
                            <p>
                                Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in San Francisco, California, except that either party may seek injunctive relief in court.
                            </p>
                        </Section>

                        <Section title="13. General Provisions">
                            <p><strong>Entire Agreement:</strong></p>
                            <p>
                                These Terms, together with our Privacy Policy, constitute the entire agreement between you and trakaply.
                            </p>
                            
                            <p className="mt-4"><strong>Severability:</strong></p>
                            <p>
                                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                            </p>
                            
                            <p className="mt-4"><strong>No Waiver:</strong></p>
                            <p>
                                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </Section>

                        <Section title="14. Contact Information">
                            <p>
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <ul className="list-none space-y-2 mt-4">
                                <li><strong>Email:</strong> legal@trakaply.com</li>
                                <li><strong>Address:</strong> trakaply Inc., 123 Tech Street, San Francisco, CA 94105</li>
                            </ul>
                        </Section>

                        <div className="mt-12 p-6 bg-primary-light rounded-lg border border-primary-blue/20">
                            <p className="text-sm text-neutral-text-primary-light">
                                <strong>By using trakaply, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfServicePage;
