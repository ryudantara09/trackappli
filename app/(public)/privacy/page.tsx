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

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-neutral-bg-light dark:bg-neutral-bg-dark min-h-screen text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            <Header variant="landing" />
            
            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 pt-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-text-primary-light mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-neutral-gray">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-lg border border-neutral-border-light dark:border-neutral-border-dark p-8 md:p-12">
                        <Section title="1. Introduction">
                            <p>
                                Welcome to trakappli (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our job application tracking service.
                            </p>
                            <p>
                                By using trakappli, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
                            </p>
                        </Section>

                        <Section title="2. Information We Collect">
                            <p><strong>Personal Information:</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Account information (name, email address, password)</li>
                                <li>Profile information you choose to provide</li>
                                <li>Job application data (company names, positions, locations, dates, notes)</li>
                                <li>Resume and cover letter content (if uploaded)</li>
                            </ul>
                            
                            <p className="mt-4"><strong>Automatically Collected Information:</strong></p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Device information (browser type, operating system)</li>
                                <li>Usage data (pages viewed, features used, time spent)</li>
                                <li>IP address and approximate location</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </Section>

                        <Section title="3. How We Use Your Information">
                            <p>We use your information to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process AI-powered job data extraction (via Google Gemini)</li>
                                <li>Send you service-related notifications and updates</li>
                                <li>Respond to your comments, questions, and customer service requests</li>
                                <li>Analyze usage patterns to improve user experience</li>
                                <li>Detect, prevent, and address technical issues and security threats</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </Section>

                        <Section title="4. Data Sharing and Disclosure">
                            <p>
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (e.g., Google Gemini for AI processing, hosting providers)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
                                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
                                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                            </ul>
                        </Section>

                        <Section title="5. Data Security">
                            <p>
                                We implement industry-standard security measures to protect your data, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Secure authentication and password hashing</li>
                                <li>Regular security audits and monitoring</li>
                                <li>Access controls and employee training</li>
                            </ul>
                            <p className="mt-4">
                                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                            </p>
                        </Section>

                        <Section title="6. Your Rights and Choices">
                            <p>You have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                                <li><strong>Export:</strong> Download your application data in CSV format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails (service emails may still be sent)</li>
                                <li><strong>Withdraw Consent:</strong> Revoke consent for data processing where applicable</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, contact us at privacy@trakappli.com or through your account settings.
                            </p>
                        </Section>

                        <Section title="7. Data Retention">
                            <p>
                                We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your data within 30 days, except where we are required to retain it for legal, accounting, or security purposes.
                            </p>
                        </Section>

                        <Section title="8. Cookies and Tracking">
                            <p>
                                We use cookies and similar technologies to enhance your experience, analyze usage, and remember your preferences. You can control cookie settings through your browser, but disabling cookies may limit functionality.
                            </p>
                        </Section>

                        <Section title="9. Third-Party Services">
                            <p>
                                Our service integrates with third-party providers, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Google Gemini:</strong> For AI-powered job data extraction (subject to Google&apos;s privacy policy)</li>
                                <li><strong>Authentication Providers:</strong> Google and GitHub for social login (optional)</li>
                            </ul>
                            <p className="mt-4">
                                These third parties have their own privacy policies. We are not responsible for their practices.
                            </p>
                        </Section>

                        <Section title="10. Children's Privacy">
                            <p>
                                trakappli is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                            </p>
                        </Section>

                        <Section title="11. International Data Transfers">
                            <p>
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.
                            </p>
                        </Section>

                        <Section title="12. Changes to This Policy">
                            <p>
                                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after changes constitutes acceptance.
                            </p>
                        </Section>

                        <Section title="13. Contact Us">
                            <p>
                                If you have questions or concerns about this privacy policy, please contact us:
                            </p>
                            <ul className="list-none space-y-2 mt-4">
                                <li><strong>Email:</strong> privacy@trakappli.com</li>
                                <li><strong>Address:</strong> trakappli Inc., 123 Tech Street, San Francisco, CA 94105</li>
                            </ul>
                        </Section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
