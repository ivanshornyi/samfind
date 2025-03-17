import EllipsePolicyImage from "@public/policy-bg.png";
import Image from "next/image";
import Link from "next/link";

export default function Policy() {
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
        Privacy Policy
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
        <p>Introduction</p>
        <p>
          {`At Onsio ("we," "our," or "us"), we take your privacy seriously. This
          Privacy Policy explains how we collect, use, and protect your
          information when you visit our website. Our commitment to privacy is
          fundamental to our business model, which is built on offline-first,
          privacy-preserving technology solutions.`}
        </p>
        <p>Information We Collect</p>
        <div>
          <p>Information Collected Automatically</p>
          <p>We collect standard web analytics data, including:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Device information
            </li>
            <li className="before:content-['-'] before:mr-2">
              Pages visited on our website
            </li>
            <li className="before:content-['-'] before:mr-2">
              Time spent on our website
            </li>
          </ul>
        </div>
        <p>
          We use this information solely for website optimization and do not
          combine it with any personal data.
        </p>
        <p>How We Use Your Information</p>
        <div>
          <p>We use the collected information for:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Responding to your inquiries
            </li>
            <li className="before:content-['-'] before:mr-2">
              Sending important updates about our services
            </li>
            <li className="before:content-['-'] before:mr-2">
              {`Improving our website's user experience`}
            </li>
            <li className="before:content-['-'] before:mr-2">
              Analyzing website traffic patterns
            </li>
          </ul>
        </div>
        <p>Data Storage and Security</p>
        <div>
          <p>Minimal Data Storage</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              We follow a strict minimal data collection policy
            </li>
            <li className="before:content-['-'] before:mr-2">
              We do not store any unnecessary personal information
            </li>
            <li className="before:content-['-'] before:mr-2">
              All collected data is stored securely within your jurisdiction
            </li>
          </ul>
        </div>
        <div>
          <p>Security Measures</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Industry-standard encryption for all data in transit
            </li>
            <li className="before:content-['-'] before:mr-2">
              Regular security audits and updates
            </li>
            <li className="before:content-['-'] before:mr-2">
              Strict access controls and authentication procedures
            </li>
          </ul>
        </div>
        <p>No Third-Party Data Sharing</p>
        <div>
          <p>We do not:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Sell your personal information to third parties
            </li>
            <li className="before:content-['-'] before:mr-2">
              Share your data with advertisers
            </li>
            <li className="before:content-['-'] before:mr-2">
              Use your information for marketing purposes without consent
            </li>
          </ul>
        </div>
        <p>Cookies and Tracking</p>
        <div>
          <p>We use essential cookies only for:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Website functionality
            </li>
            <li className="before:content-['-'] before:mr-2">
              Session management
            </li>
            <li className="before:content-['-'] before:mr-2">
              Security purposes
            </li>
          </ul>
        </div>
        <p>
          You can disable cookies through your browser settings, though this may
          affect basic website functionality.
        </p>
        <p>Your Privacy Rights</p>
        <div>
          <p>You have the right to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Access your personal information
            </li>
            <li className="before:content-['-'] before:mr-2">
              Request correction of your data
            </li>
            <li className="before:content-['-'] before:mr-2">
              Request deletion of your data
            </li>
            <li className="before:content-['-'] before:mr-2">
              Opt-out of communications
            </li>
            <li className="before:content-['-'] before:mr-2">
              Object to data processing
            </li>
            <li className="before:content-['-'] before:mr-2">
              Request data portability
            </li>
          </ul>
        </div>
        <p>{`Children's Privacy`}</p>
        <p>
          Our website and services are not directed at children under 13 years
          of age. We do not knowingly collect personal information from
          children.
        </p>
        <p>International Data Transfers</p>
        <div>
          <p>
            When necessary, any international data transfers are conducted in
            compliance with:
          </p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Applicable data protection laws
            </li>
            <li className="before:content-['-'] before:mr-2">
              Standard contractual clauses
            </li>
            <li className="before:content-['-'] before:mr-2">
              Appropriate safeguards for data protection
            </li>
          </ul>
        </div>
        <p>Changes to This Policy</p>
        <div>
          <p>
            We may update this Privacy Policy periodically. We will notify you
            of any material changes by:
          </p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Posting the new Privacy Policy on this page
            </li>
            <li className="before:content-['-'] before:mr-2">
              {`Updating the "Last Updated" date`}
            </li>
            <li className="before:content-['-'] before:mr-2">
              Sending an email notification for significant changes
            </li>
          </ul>
        </div>
        <p>Contact Us</p>
        <p>
          If you have questions about this Privacy Policy or our privacy
          practices, please contact us at:
        </p>
        <div>
          <p>Contact Us</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us at{" "}
              <Link href="/support" className="text-blue-500 hover:underline">
                Support
              </Link>
              .
            </li>
          </ul>
        </div>
        <p>Compliance</p>
        <div>
          <p>
            This Privacy Policy complies with applicable data protection laws,
            including:
          </p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              General Data Protection Regulation (GDPR)
            </li>
            <li className="before:content-['-'] before:mr-2">
              Local data protection regulations in operating regions
            </li>
          </ul>
        </div>
        <p>Data Retention</p>
        <div>
          <p>
            We retain your personal information only for as long as necessary
            to:
          </p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Fulfill the purposes outlined in this policy
            </li>
            <li className="before:content-['-'] before:mr-2">
              Comply with legal obligations
            </li>
            <li className="before:content-['-'] before:mr-2">
              Resolve disputes
            </li>
            <li className="before:content-['-'] before:mr-2">
              Enforce our agreements
            </li>
          </ul>
        </div>
        <p>
          After this period, your data will be securely deleted or anonymized.
        </p>
      </div>
    </div>
  );
}
