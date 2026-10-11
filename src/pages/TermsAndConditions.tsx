import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';

export function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader />
      <div className="page-content" style={{ paddingTop: 12, paddingBottom: 60 }}>

        {/* Back + Title */}
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
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Effective date: 1 October 2024 · Last updated: 1 October 2024
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <Section title="1. About CoWallet">
            <p>
              CoWallet ("the App", "we", "our") is a collaborative payments platform that enables
              groups of individuals to pool money, manage shared expenses, and make group
              contributions within India. CoWallet is operated by CoWallet Technologies Pvt. Ltd.,
              a company incorporated under the Companies Act, 2013.
            </p>
            <p style={{ marginTop: 10 }}>
              By downloading, installing, or using the App, you agree to be bound by these Terms
              &amp; Conditions ("Terms"). If you do not agree, you must not use the App.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>To use CoWallet you must:</p>
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Be at least 18 years of age.</li>
              <li>Be a resident of India with a valid bank account and Indian mobile number.</li>
              <li>Complete KYC verification as required by applicable RBI guidelines.</li>
              <li>Not be prohibited from using financial services under any applicable law.</li>
            </ul>
          </Section>

          <Section title="3. Account Registration">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials,
              PIN, and biometric authentication data. Any activity carried out from your account
              is deemed to have been authorised by you. You must notify us immediately at
              <strong> support@cowallet.in</strong> if you suspect unauthorised access.
            </p>
            <p style={{ marginTop: 10 }}>
              We reserve the right to suspend or terminate accounts that we reasonably believe are
              being used fraudulently or in breach of these Terms.
            </p>
          </Section>

          <Section title="4. Group Vaults and Pooled Funds">
            <p>
              CoWallet enables users to create and join Group Vaults. Money contributed to a vault
              is held in a designated escrow account with our banking partner and governed by a
              multi-signature authorisation protocol agreed upon at vault creation.
            </p>
            <p style={{ marginTop: 10 }}>
              Vault administrators are responsible for ensuring contributions are used for the
              agreed group purpose. CoWallet does not assume fiduciary responsibility for fund
              disputes arising between group members.
            </p>
          </Section>

          <Section title="5. Fees">
            <p>
              CoWallet does not currently charge fees for creating or joining vaults, contributing
              funds, or sending money. Where third-party banking or UPI network fees apply, they
              will be clearly disclosed before a transaction is confirmed.
            </p>
            <p style={{ marginTop: 10 }}>
              We reserve the right to introduce fees in the future with a minimum of 30 days'
              advance notice communicated through the App.
            </p>
          </Section>

          <Section title="6. Prohibited Conduct">
            <p>You must not use CoWallet to:</p>
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Facilitate money laundering, fraud, or any other criminal activity.</li>
              <li>Collect funds under false or misleading pretences.</li>
              <li>Violate any applicable law, regulation, or RBI guideline.</li>
              <li>Circumvent transaction limits imposed by payment networks or regulators.</li>
              <li>Impersonate another person or entity.</li>
            </ul>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, CoWallet and its directors, employees, and
              agents will not be liable for indirect, incidental, special, or consequential damages
              arising from your use of the App, including loss of funds due to unauthorised access
              resulting from your failure to keep credentials secure.
            </p>
          </Section>

          <Section title="8. Dispute Resolution">
            <p>
              Any dispute arising from these Terms shall be resolved first through good-faith
              negotiation. If unresolved within 30 days, it will be submitted to arbitration under
              the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Pune,
              Maharashtra.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These Terms are governed by the laws of India. The courts of Pune, Maharashtra shall
              have exclusive jurisdiction to settle any dispute or claim arising out of or in
              connection with these Terms.
            </p>
          </Section>

          <Section title="10. Changes to These Terms">
            <p>
              We may update these Terms from time to time. The revised version will be posted in
              the App with an updated effective date. Continued use of the App after changes are
              posted constitutes your acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For questions about these Terms, write to us at:<br />
              <strong>CoWallet Technologies Pvt. Ltd.</strong><br />
              legal@cowallet.in<br />
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
