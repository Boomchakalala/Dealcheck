export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1>Terms of Service</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using DealCheck, you accept and agree to be bound by the
          terms and provisions of this agreement.
        </p>

        <h2>Description of Service</h2>
        <p>
          DealCheck is a procurement analysis tool that helps non-procurement
          professionals analyze supplier quotes and contracts. The service uses
          AI to provide guidance and suggestions.
        </p>

        <h2>Important Disclaimers</h2>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg not-prose">
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Not Legal Advice:</strong> DealCheck does not provide legal advice.
              All analysis and suggestions are for informational purposes only.
            </li>
            <li>
              <strong>No Proprietary Data:</strong> We do not have access to proprietary
              pricing benchmarks or market rate databases. All analysis is based on the
              information you provide.
            </li>
            <li>
              <strong>Your Responsibility:</strong> You are solely responsible for all
              business decisions, contract negotiations, and legal compliance.
            </li>
            <li>
              <strong>Professional Consultation:</strong> Always consult with appropriate
              legal, financial, or procurement professionals before making significant
              commitments.
            </li>
          </ul>
        </div>

        <h2>User Responsibilities</h2>
        <p>
          You agree to:
        </p>
        <ul>
          <li>Provide accurate information</li>
          <li>Use the service lawfully and ethically</li>
          <li>Not share sensitive or confidential information you're not authorized to share</li>
          <li>Verify all AI-generated suggestions before acting on them</li>
        </ul>

        <h2>Usage Limits</h2>
        <p>
          Free accounts are limited to 2 analysis rounds total. Additional usage
          requires a paid plan.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          You retain all rights to your uploaded content. We retain rights to the
          DealCheck platform and AI-generated analysis format.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          DealCheck is provided "as is" without warranties of any kind. We are not
          liable for any decisions you make based on our analysis, or for any
          damages resulting from use of the service.
        </p>

        <h2>Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to our service
          immediately, without prior notice, for any reason.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of the service constitutes acceptance of modified terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these Terms, please contact us.
        </p>
      </div>
    </div>
  )
}
