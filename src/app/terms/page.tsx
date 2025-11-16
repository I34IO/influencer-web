'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Last updated: November 16, 2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By accessing and using Trust Influencer ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            {/* Use of Service */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use of Service</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You may use our Service only as permitted by law. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Upload or transmit viruses or any other malicious code</li>
                <li>Collect or harvest any information from the Service</li>
                <li>Impersonate any person or entity</li>
                <li>Submit false, misleading, or fraudulent information</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Accounts</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. 
                You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>Restricting access to your computer and account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            {/* Content */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Content</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, 
                graphics, or other material ("Content"). You are responsible for the Content that you post on or through the 
                Service, including its legality, reliability, and appropriateness.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By posting Content on or through the Service, you grant us the right and license to use, modify, publicly 
                perform, publicly display, reproduce, and distribute such Content on and through the Service.
              </p>
            </section>

            {/* Ratings and Reviews */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ratings and Reviews</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When submitting ratings and reviews about influencers, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Provide honest and accurate information based on your genuine experience</li>
                <li>Not submit false, misleading, or defamatory content</li>
                <li>Not engage in coordinated rating manipulation</li>
                <li>Respect the privacy and rights of others</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intellectual Property</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Service and its original content (excluding Content provided by users), features, and functionality are 
                and will remain the exclusive property of Trust Influencer and its licensors. The Service is protected by 
                copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service 
                without our prior written consent.
              </p>
            </section>

            {/* Subscriptions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subscriptions and Payments</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring 
                basis. Billing cycles are set on a monthly or annual basis, depending on the subscription plan you select.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You may cancel your subscription at any time through your account settings. Upon cancellation, you will 
                continue to have access to the Service until the end of your current billing period.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Disclaimer</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, 
                and hereby disclaim all warranties including, without limitation, implied warranties of merchantability, 
                fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. We do not warrant 
                the accuracy or completeness of the information provided through the Service.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                In no event shall Trust Influencer, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or 
                inability to access or use the Service.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Governing Law</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard 
                to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be 
                considered a waiver of those rights.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide 
                at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be 
                determined at our sole discretion.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Termination</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
                liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach 
                the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
                <li>• By email: legal@trustinfluencer.com</li>
                <li>• By visiting our <Link href="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">contact page</Link></li>
              </ul>
            </section>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/privacy"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-center transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
