export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1>Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, including:
        </p>
        <ul>
          <li>Email address and account credentials</li>
          <li>Documents and text you upload for analysis</li>
          <li>Usage data and preferences</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process and analyze your procurement documents</li>
          <li>Send you technical notices and support messages</li>
          <li>Monitor and analyze usage patterns</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          By default, we do NOT store the raw text extracted from your uploaded files.
          We only retain the AI-generated analysis and metadata unless you explicitly
          choose to save extracted text.
        </p>

        <h2>AI Processing</h2>
        <p>
          We use OpenAI's API to analyze your documents. Your data is sent to OpenAI
          for processing. Please review OpenAI's privacy policy for details on how
          they handle data.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect
          your personal information. However, no method of transmission over the
          internet is 100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information
          at any time. Contact us if you wish to exercise these rights.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  )
}
