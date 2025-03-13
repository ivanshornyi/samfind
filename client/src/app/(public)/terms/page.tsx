import EllipsePolicyImage from "@public/policy-bg.png";
import Image from "next/image";

export default function TermsOfUse() {
  return (
    <div className="w-full space-y-6 sm:space-y-[68px] py-14 relative">
      <Image
        src={EllipsePolicyImage}
        width={1000}
        height={1200}
        alt="Background illustration"
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-[-1]"
      />
      <h1 className="font-semibold text-[32px]  sm:text-[48px] text-center">
        Terms of Use
      </h1>
      <p
        className="mx-auto max-w-[300px] p-[26px] py-[6px] text-[16px] font-medium bg-[#242424] rounded-full"
        style={{ marginTop: "25px" }}
      >
        Last Updated: February 10, 2025
      </p>
      <div
        className="flex flex-col gap-4 mt-4 text-[16px] font-medium sm:px-[140px]"
        style={{ marginTop: "36px" }}
      >
        <p className="pl-1">1. Acceptance of Terms</p>
        <p>
          {`By accessing and using the Onsio website and services ("Services"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, please do not use our Services.`}
        </p>
        <p className="pl-1">2. Service Description</p>
        <p>
          Onsio provides privacy-first, offline-capable enterprise software
          solutions designed for secure document processing and data handling.
          Our Services operate primarily offline and do not require cloud
          storage or continuous internet connectivity.
        </p>
        <p className="pl-1">3. User Registration and Account Security</p>
        <div>
          <p className="pl-1">3.1 Account Creation</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              You must provide accurate, current, and complete information
              during registration
            </li>
            <li className="before:content-['-'] before:mr-2">
              You are responsible for maintaining the confidentiality of your
              account credentials
            </li>
            <li className="before:content-['-'] before:mr-2">
              You must be at least 18 years old to create an account
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">3.2 Account Security</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              You are responsible for all activities under your account
            </li>
            <li className="before:content-['-'] before:mr-2">
              Notify us immediately of any unauthorized access
            </li>
            <li className="before:content-['-'] before:mr-2">
              Implement reasonable security measures to protect access
              credentials
            </li>
          </ul>
        </div>
        <p className="pl-1">4. License and Usage Rights</p>
        <div>
          <p className="pl-1">4.1 Grant of License</p>
          <p>We grant you a non-exclusive, non-transferable license to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Install and use our software
            </li>
            <li className="before:content-['-'] before:mr-2">
              Process documents within your organization
            </li>
            <li className="before:content-['-'] before:mr-2">
              Create and maintain offline databases
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">4.2 Usage Restrictions</p>
          <p>You agree not to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Reverse engineer the software
            </li>
            <li className="before:content-['-'] before:mr-2">
              Copy or modify the software
            </li>
            <li className="before:content-['-'] before:mr-2">
              Distribute or sublicense the software
            </li>
            <li className="before:content-['-'] before:mr-2">
              Use the software for unauthorized purposes
            </li>
            <li className="before:content-['-'] before:mr-2">
              Attempt to circumvent security measures
            </li>
          </ul>
        </div>
        <p className="pl-1">5. Payment Terms</p>
        <div>
          <p className="pl-1">5.1 Fees</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Fees are based on per-user pricing ($10/user/month)
            </li>
            <li className="before:content-['-'] before:mr-2">
              All fees are non-refundable unless otherwise stated
            </li>
            <li className="before:content-['-'] before:mr-2">
              Payments must be made in advance
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">5.2 Billing</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Billing occurs on a monthly or annual basis
            </li>
            <li className="before:content-['-'] before:mr-2">
              You are responsible for all applicable taxes
            </li>
            <li className="before:content-['-'] before:mr-2">
              Late payments may result in service suspension
            </li>
          </ul>
        </div>
        <p className="pl-1">6. Data Handling and Privacy</p>
        <div>
          <p className="pl-1">6.1 Local Processing</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              All data processing occurs locally on your devices
            </li>
            <li className="before:content-['-'] before:mr-2">
              No data is transmitted to cloud servers
            </li>
            <li className="before:content-['-'] before:mr-2">
              You maintain full control over your data
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">6.2 Data Security</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              You are responsible for securing locally processed data
            </li>
            <li className="before:content-['-'] before:mr-2">
              Implement appropriate security measures
            </li>
            <li className="before:content-['-'] before:mr-2">
              Follow industry best practices for data protection
            </li>
          </ul>
        </div>
        <p className="pl-1">7. Intellectual Property Rights</p>
        <div>
          <p className="pl-1">7.1 Ownership</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              We retain all rights to our software and technology
            </li>
            <li className="before:content-['-'] before:mr-2">
              You retain all rights to your data and documents
            </li>
            <li className="before:content-['-'] before:mr-2">
              No transfer of intellectual property is implied
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">7.2 Feedback</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              We welcome feedback on our Services
            </li>
            <li className="before:content-['-'] before:mr-2">
              Any feedback provided may be used without restriction
            </li>
            <li className="before:content-['-'] before:mr-2">
              No compensation is due for feedback
            </li>
          </ul>
        </div>
        <p className="pl-1">8. Warranties and Disclaimers</p>
        <div>
          <p className="pl-1">8.1 Service Warranty</p>
          <p>We warrant that our Services will:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Perform substantially as described
            </li>
            <li className="before:content-['-'] before:mr-2">
              Operate offline as advertised
            </li>
            <li className="before:content-['-'] before:mr-2">
              Maintain data privacy as specified
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">8.2 Disclaimer</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              {`Services are provided "as is"`}
            </li>
            <li className="before:content-['-'] before:mr-2">
              No guarantee of uninterrupted service
            </li>
            <li className="before:content-['-'] before:mr-2">
              No warranty for specific outcomes
            </li>
          </ul>
        </div>
        <p className="pl-1">9. Limitation of Liability</p>
        <div>
          <p className="pl-1">9.1 Liability Cap</p>
          <p>Our liability is limited to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              The amount paid for Services in the past 12 months
            </li>
            <li className="before:content-['-'] before:mr-2">
              Direct damages only
            </li>
            <li className="before:content-['-'] before:mr-2">
              Excludes consequential damages
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">9.2 Exclusions</p>
          <p>We are not liable for:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Data loss due to local hardware failure
            </li>
            <li className="before:content-['-'] before:mr-2">
              Issues arising from misuse
            </li>
            <li className="before:content-['-'] before:mr-2">
              Third-party claims
            </li>
          </ul>
        </div>
        <p className="pl-1">10. Term and Termination</p>
        <div>
          <p className="pl-1">10.1 Term</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              These Terms remain in effect until terminated
            </li>
            <li className="before:content-['-'] before:mr-2">
              Either party may terminate with notice
            </li>
            <li className="before:content-['-'] before:mr-2">
              Paid subscriptions continue until period end
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">10.2 Effect of Termination</p>
          <p>Upon termination:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Access to Services ends
            </li>
            <li className="before:content-['-'] before:mr-2">
              You retain your processed data
            </li>
            <li className="before:content-['-'] before:mr-2">
              Confidentiality obligations continue
            </li>
          </ul>
        </div>
        <p className="pl-1">11. Compliance with Laws</p>
        <div>
          <p className="pl-1">11.1 Legal Compliance</p>
          <p>You agree to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Comply with all applicable laws
            </li>
            <li className="before:content-['-'] before:mr-2">
              Obtain necessary permits
            </li>
            <li className="before:content-['-'] before:mr-2">
              Respect data protection regulations
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">11.2 Export Control</p>
          <p>You agree to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Comply with export control laws
            </li>
            <li className="before:content-['-'] before:mr-2">
              No use in restricted countries
            </li>
            <li className="before:content-['-'] before:mr-2">
              Verify legal compliance before use
            </li>
          </ul>
        </div>
        <p className="pl-1">12. Changes to Terms</p>
        <div>
          <p>We reserve the right to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Modify these Terms at any time
            </li>
            <li className="before:content-['-'] before:mr-2">
              Provide notice of material changes
            </li>
            <li className="before:content-['-'] before:mr-2">
              Continue service subject to new Terms
            </li>
          </ul>
        </div>
        <p className="pl-1">13. Governing Law and Jurisdiction</p>
        <div>
          <p className="pl-1">13.1 Governing Law</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              These Terms are governed by [Jurisdiction] law
            </li>
            <li className="before:content-['-'] before:mr-2">
              Disputes subject to exclusive jurisdiction
            </li>
            <li className="before:content-['-'] before:mr-2">
              Alternative dispute resolution available
            </li>
          </ul>
        </div>
        <div>
          <p className="pl-1">13.2 Severability</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Invalid provisions shall be severed
            </li>
            <li className="before:content-['-'] before:mr-2">
              Remaining Terms remain in effect
            </li>
            <li className="before:content-['-'] before:mr-2">
              Good faith modification of invalid terms
            </li>
          </ul>
        </div>
        <p className="pl-1">14. Contact Information</p>
        <div>
          <p>For questions about these Terms:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Email: legal@onsio.com
            </li>
            <li className="before:content-['-'] before:mr-2">
              Address: [Your Business Address]
            </li>
            <li className="before:content-['-'] before:mr-2">
              Phone: [Your Contact Number]
            </li>
          </ul>
        </div>
        <p className="pl-1">15. Acknowledgment</p>
        <p>
          By using our Services, you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Use.
        </p>
      </div>
    </div>
  );
}
