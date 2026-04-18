import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card className="p-8">
          <div className="prose prose-gray max-w-none">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Your Privacy Matters to Us</h2>
            </div>

            <p className="text-gray-700 mb-6">
              At ClipGenius, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your data.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>1.1 Personal Information</h3>
            <ul>
              <li>Name, email address, and contact information</li>
              <li>Business information (company name, industry, location)</li>
              <li>Payment information (processed securely by third-party providers)</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3>1.2 Usage Data</h3>
            <ul>
              <li>Content created and campaigns sent</li>
              <li>Platform interactions and feature usage</li>
              <li>IP address, browser type, and device information</li>
              <li>Log data and analytics</li>
            </ul>

            <h3>1.3 Third-Party Data</h3>
            <ul>
              <li>Lead data from integrated scraping services</li>
              <li>Social media platform data</li>
              <li>Email service provider data</li>
            </ul>

            <h2>2. How We Use Your Information</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Primary Uses</h4>
                  <ul className="text-blue-800 text-sm">
                    <li>• Provide and maintain our services</li>
                    <li>• Process transactions and manage subscriptions</li>
                    <li>• Personalize your experience</li>
                    <li>• Communicate about updates and features</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>3. Data Security</h2>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Security Measures</h4>
                  <ul className="text-green-800 text-sm">
                    <li>• End-to-end encryption for data transmission</li>
                    <li>• Secure storage with access controls</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Employee training on data protection</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>4. Data Sharing and Third Parties</h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Database className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Third-Party Services</h4>
                  <p className="text-yellow-800 text-sm mb-2">
                    We integrate with various services to provide our platform features:
                  </p>
                  <ul className="text-yellow-800 text-sm">
                    <li>• AI services (Anthropic Claude, OpenAI)</li>
                    <li>• Lead scraping (Apify, VibeProspecting)</li>
                    <li>• Communication (Twilio, SendGrid)</li>
                    <li>• Social platforms (Meta, LinkedIn, Twitter)</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>5. Your Rights</h2>
            <p>Under applicable data protection laws, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Delete your personal data ("right to be forgotten")</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage,
              and provide personalized content. You can control cookie preferences through your browser settings.
            </p>

            <h2>7. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data during such transfers.
            </p>

            <h2>8. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide our services and comply with legal obligations.
              When data is no longer needed, it is securely deleted or anonymized.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal
              information from children under 13. If you believe we have collected such information,
              please contact us immediately.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by email or through our platform. Your continued use of our services after such
              changes constitutes acceptance of the updated policy.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@clipgenius.ai</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Business Street, Tech City, TC 12345</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Data Protection Officer:</strong> For GDPR and privacy-related inquiries,
                contact our Data Protection Officer at dpo@clipgenius.ai
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}