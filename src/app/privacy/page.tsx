export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
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
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support. This may include:
          </p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Property search preferences and criteria</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Communications with our support team</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Personalize your experience</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except in the following circumstances:
          </p>
          <ul>
            <li>With service providers who assist us in operating our platform</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or acquisition</li>
            <li>With your explicit consent</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. This includes:
          </p>
          <ul>
            <li>SSL encryption for all data transmission</li>
            <li>Secure data storage with industry-standard encryption</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
            <li>Withdraw consent where applicable</li>
          </ul>

          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
            and provide personalized content. You can control cookie settings through your browser preferences.
          </p>

          <h2>7. Third-Party Services</h2>
          <p>
            Our platform may integrate with third-party services (such as payment processors and analytics tools). 
            These services have their own privacy policies, and we encourage you to review them.
          </p>

          <h2>8. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting 
            the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@revara.com</li>
            <li>Address: 123 Investment Ave, Miami, FL 33101</li>
            <li>Phone: +1 (555) 123-4567</li>
          </ul>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">GDPR Compliance</h3>
            <p className="text-blue-800">
              We are fully compliant with the General Data Protection Regulation (GDPR) and other applicable 
              data protection laws. We process personal data lawfully, fairly, and transparently, and we respect 
              your rights as a data subject.
            </p>
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">CCPA Compliance</h3>
            <p className="text-green-800">
              We comply with the California Consumer Privacy Act (CCPA) and provide California residents with 
              specific rights regarding their personal information, including the right to know, delete, and opt-out 
              of the sale of personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
