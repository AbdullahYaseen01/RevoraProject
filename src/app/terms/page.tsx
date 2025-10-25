export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-purple-100">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Revara's services, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Revara provides a comprehensive platform for real estate investors, including but not limited to:
          </p>
          <ul>
            <li>Property search and analysis tools</li>
            <li>Cash buyer network and matching services</li>
            <li>Skip tracing and contact information services</li>
            <li>Contract management and digital signature capabilities</li>
            <li>Analytics and reporting features</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of our service, you must create an account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use our service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Transmit harmful or malicious content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the service for fraudulent or deceptive purposes</li>
            <li>Spam or send unsolicited communications</li>
          </ul>

          <h2>5. Payment Terms</h2>
          <p>
            Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable 
            except as required by law. We reserve the right to change our pricing with 30 days' notice.
          </p>

          <h2>6. Data and Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
            of the service, to understand our practices regarding the collection and use of your information.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by Revara and are 
            protected by international copyright, trademark, patent, trade secret, and other intellectual 
            property laws.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            Our service may integrate with third-party services. We are not responsible for the content, 
            privacy policies, or practices of any third-party services.
          </p>

          <h2>9. Disclaimers</h2>
          <p>
            The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, 
            expressed or implied, and hereby disclaim all other warranties including, without limitation, 
            implied warranties or conditions of merchantability, fitness for a particular purpose, or 
            non-infringement of intellectual property.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            In no event shall Revara, nor its directors, employees, partners, agents, suppliers, or affiliates, 
            be liable for any indirect, incidental, special, consequential, or punitive damages, including 
            without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
            from your use of the service.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Revara and its licensee and licensors, and 
            their employees, contractors, agents, officers and directors, from and against any and all claims, 
            damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited 
            to attorney's fees).
          </p>

          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the service immediately, without 
            prior notice or liability, under our sole discretion, for any reason whatsoever and without 
            limitation, including but not limited to a breach of the Terms.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the State of Florida, United States, 
            without regard to its conflict of law provisions.
          </p>

          <h2>14. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            If a revision is material, we will provide at least 30 days' notice prior to any new terms 
            taking effect.
          </p>

          <h2>15. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: legal@revara.com</li>
            <li>Address: 123 Investment Ave, Miami, FL 33101</li>
            <li>Phone: +1 (555) 123-4567</li>
          </ul>

          <div className="mt-12 p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notice</h3>
            <p className="text-yellow-800">
              By using our service, you acknowledge that you have read, understood, and agree to be bound 
              by these Terms of Service. If you do not agree to these terms, please discontinue use of our service.
            </p>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Dispute Resolution</h3>
            <p className="text-blue-800">
              Any disputes arising from these terms or your use of our service will be resolved through 
              binding arbitration in accordance with the rules of the American Arbitration Association, 
              except that either party may seek injunctive relief in court to prevent irreparable harm.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
