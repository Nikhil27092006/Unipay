import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 12, paddingBottom: 60 }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', padding: 0,
            fontSize: 13, fontWeight: 600, color: '#2563EB',
            cursor: 'pointer', marginBottom: 20,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', marginBottom: 6 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Effective date: 1 October 2024 · Last updated: 1 October 2024
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <Section title="1. Who We Are">
            <p>
              CoWallet Technologies Pvt. Ltd. ("CoWallet", "we", "us", "our") operates the
              CoWallet mobile application. This Privacy Policy explains what personal data we
              collect, why we collect it, and your rights regarding it.
            </p>
            <p style={{ marginTop: 10 }}>
              This policy applies to all users of CoWallet and is subject to the Information
              Technology Act, 2000 and the Information Technology (Reasonable Security Practices
              and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect the following categories of information:</p>
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Identity data:</strong> Full name, date of birth, Aadhaar number
                (encrypted), PAN (where required for higher transaction limits).
              </li>
              <li>
                <strong>Contact data:</strong> Mobile number, email address.
              </li>
              <li>
                <strong>Financial data:</strong> Bank account details (stored with our banking
                partner), UPI ID, transaction history within the App.
              </li>
              <li>
                <strong>Device data:</strong> Device model, OS version, device identifiers,
                IP address, app version.
              </li>
              <li>
                <strong>Usage data:</strong> Pages visited within the App, feature interactions,
                timestamps.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use your data to:</p>
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Verify your identity and comply with RBI KYC requirements.</li>
              <li>Process payments, contributions, and group vault transactions.</li>
              <li>Detect and prevent fraud and unauthorised access.</li>
              <li>Send transaction notifications and account alerts.</li>
              <li>Improve the App through aggregated, anonymised analytics.</li>
              <li>Comply with legal obligations and law enforcement requests.</li>
            </ul>
            <p style={{ marginTop: 10 }}>
              We do not sell your personal data to third parties. We do not use your data for
              advertising purposes on third-party platforms.
            </p>
          </Section>

          <Section title="4. Data Sharing">
            <p>We share data only with:</p>
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Banking partners and UPI processors</strong> — to settle transactions.
                These partners are bound by RBI regulations and data protection agreements.
              </li>
              <li>
                <strong>KYC service providers</strong> — to verify identity documents as required
                by law.
              </li>
              <li>
                <strong>Infrastructure providers</strong> — cloud hosting and data storage
                providers operating under strict confidentiality agreements.
              </li>
              <li>
                <strong>Regulators and law enforcement</strong> — when required by applicable law
                or a valid court order.
              </li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your personal data for as long as your account is active and for a further
              period of 5 years after account closure, as required by RBI guidelines for payment
              records.
            </p>
            <p style={{ marginTop: 10 }}>
              Anonymised usage analytics may be retained indefinitely.
            </p>
          </Section>

          <Section title="6. Security">
            <p>
              We implement industry-standard security measures including AES-256 encryption at
              rest, TLS 1.3 in transit, multi-signature vault authorisation, device binding, and
              biometric authentication. We conduct periodic security audits.
            </p>
            <p style={{ marginTop: 10 }}>
              No system is completely secure. You are responsible for keeping your device PIN and
              login credentials confidential.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Access:</strong> Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Ask us to correct inaccurate or incomplete data.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and associated data,
                subject to legal retention requirements.
              </li>
              <li>
                <strong>Withdraw consent:</strong> Where processing is based on consent, you may
                withdraw it at any time via the App settings.
              </li>
            </ul>
            <p style={{ marginTop: 10 }}>
              To exercise these rights, email <strong>privacy@cowallet.in</strong>. We will
              respond within 30 days.
            </p>
          </Section>

          <Section title="8. Cookies and Analytics">
            <p>
              The App does not use browser cookies. We use a self-hosted analytics tool to
              understand feature usage. This data is aggregated, does not include personally
              identifiable information, and is not shared with third-party analytics providers.
            </p>
          </Section>

          <Section title="9. Children">
            <p>
              CoWallet is not intended for individuals under 18 years of age. We do not knowingly
              collect personal data from minors. If you become aware that a minor has provided
              us with personal data, please contact us immediately.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. Changes will be notified through
              in-app notifications with the updated effective date. Your continued use of the App
              after notification constitutes acceptance.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For privacy-related queries or to exercise your rights:<br />
              <strong>CoWallet Technologies Pvt. Ltd.</strong><br />
              privacy@cowallet.in<br />
              Pune, Maharashtra, India — 411 001
            </p>
          </Section>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 14,
      padding: '18px 20px',
    }}>
      <h2 style={{
        fontSize: 14, fontWeight: 700, color: '#0F172A',
        marginBottom: 10, letterSpacing: '-0.1px',
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}
