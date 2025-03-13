import EllipsePolicyImage from "@public/policy-bg.png";
import Image from "next/image";

export default function Cookie() {
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
        Cookie Policy
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
          {`At Onsio ("we," "our," or "us"), we use a minimal number of cookies on our website. This Cookie Policy explains what cookies are, how we use them, and how you can control them.`}
        </p>
        <p>What Are Cookies?</p>
        <p>
          Cookies are small text files that are stored on your device when you
          visit our website. They help make websites work more efficiently and
          provide basic functionality such as remembering your preferences.
        </p>
        <p>How We Use Cookies</p>
        <p>
          We use cookies sparingly and only for essential purposes. Our approach
          aligns with our commitment to privacy and minimal data collection.
        </p>
        <div>
          <p>Essential Cookies (Strictly Necessary)</p>
          <p>
            These cookies are required for basic website functionality and
            cannot be disabled:
          </p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Session cookies for managing user sessions
            </li>
            <li className="before:content-['-'] before:mr-2">
              Security cookies for protecting against unauthorized access
            </li>
            <li className="before:content-['-'] before:mr-2">
              Basic functionality cookies for website operation
            </li>
          </ul>
        </div>
        <p>Duration: Session to 24 hours</p>
        <div>
          <p>Functional Cookies</p>
          <p>We use minimal functional cookies for:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Remembering your language preferences
            </li>
            <li className="before:content-['-'] before:mr-2">
              Maintaining basic user settings
            </li>
            <li className="before:content-['-'] before:mr-2">
              Improving website navigation
            </li>
          </ul>
        </div>
        <p>Duration: Up to 30 days</p>
        <div>
          <p>Performance Cookies (Analytics)</p>
          <p>We use limited analytics cookies to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Understand how our website is used
            </li>
            <li className="before:content-['-'] before:mr-2">
              Improve website performance
            </li>
            <li className="before:content-['-'] before:mr-2">
              Track basic usage patterns
            </li>
          </ul>
        </div>
        <p>Duration: Up to 90 days</p>
        <p>Cookie Details</p>
        <div>
          <p>Essential Cookies</p>
          <p>| Name | Purpose | Duration |</p>
          <p>| SESSIONID | Manages user sessions | Session |</p>
          <p>| CSRF_TOKEN | Prevents cross-site request forgery | Session |</p>
          <p>| AUTH_BASIC | Basic authentication | 24 hours |</p>
        </div>
        <div>
          <p>Functional Cookies</p>
          <p>| Name | Purpose | Duration |</p>
          <p>| LANG_PREF | Stores language preference | 30 days |</p>
          <p>| UI_SETTINGS | Saves basic UI preferences | 30 days |</p>
        </div>
        <div>
          <p>Performance Cookies</p>
          <p>| Name | Purpose | Duration |</p>
          <p>| _ga | Anonymous analytics data | 90 days |</p>
          <p>| _gid | Page view tracking | 24 hours |</p>
        </div>
        <p>No Third-Party Cookies</p>
        <div>
          <p>We do not use:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Advertising cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Social media cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Marketing cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Tracking cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Any other third-party cookies
            </li>
          </ul>
        </div>
        <p>Your Cookie Choices</p>
        <div>
          <p>Managing Cookies</p>
          <p>You can control cookies through your browser settings:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Chrome: Settings → Privacy and Security → Cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Firefox: Options → Privacy & Security → Cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Safari: Preferences → Privacy → Cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Edge: Settings → Privacy & Security → Cookies
            </li>
          </ul>
        </div>
        <div>
          <p>Cookie Consent</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              CYou can change your cookie preferences at any time
            </li>
            <li className="before:content-['-'] before:mr-2">
              Essential cookies cannot be disabled as they are required for
              website functionality
            </li>
            <li className="before:content-['-'] before:mr-2">
              Declining non-essential cookies will not affect basic website
              usage
            </li>
          </ul>
        </div>
        <p>Cookie Updates</p>
        <div>
          <p>Policy Changes</p>
          <p>We may update this Cookie Policy to reflect:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Changes in our cookie usage
            </li>
            <li className="before:content-['-'] before:mr-2">
              New regulatory requirements
            </li>
            <li className="before:content-['-'] before:mr-2">
              Improved functionality
            </li>
          </ul>
        </div>
        <div>
          <p>Notification of Changes</p>
          <p>We will notify you of significant changes through:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Website notifications
            </li>
            <li className="before:content-['-'] before:mr-2">
              Email (if subscribed to updates)
            </li>
            <li className="before:content-['-'] before:mr-2">
              {`Updated "Last Updated" date`}
            </li>
          </ul>
        </div>
        <p>Impact of Disabling Cookies</p>
        <div>
          <p>If you disable cookies:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Essential website functions will still work
            </li>
            <li className="before:content-['-'] before:mr-2">
              Some preferences may need to be reset each visit
            </li>
            <li className="before:content-['-'] before:mr-2">
              Basic analytics will not be collected
            </li>
          </ul>
        </div>
        <p>Data Protection</p>
        <div>
          <p>Our cookie usage complies with:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              General Data Protection Regulation (GDPR)
            </li>
            <li className="before:content-['-'] before:mr-2">
              Local data protection laws
            </li>
            <li className="before:content-['-'] before:mr-2">
              Industry privacy standards
            </li>
          </ul>
        </div>
        <p>Contact Us</p>
        <div>
          <p>For questions about our Cookie Policy:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Email: privacy@onsio.com
            </li>
            <li className="before:content-['-'] before:mr-2">
              Address: [Your Business Address]
            </li>
            <li className="before:content-['-'] before:mr-2">
              Phone: [Your Contact Number]
            </li>
          </ul>
        </div>
        <p>Additional Information</p>
        <div>
          <p>Technical Details:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Cookies are encrypted where necessary
            </li>
            <li className="before:content-['-'] before:mr-2">
              No personal information is stored in cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Cookies are protected against unauthorized access
            </li>
          </ul>
        </div>
        <div>
          <p>Regulatory Compliance</p>
          <p>We regularly review our cookie usage to ensure compliance with:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              Data protection regulations
            </li>
            <li className="before:content-['-'] before:mr-2">Privacy laws</li>
            <li className="before:content-['-'] before:mr-2">
              Industry standards
            </li>
          </ul>
        </div>
        <p>Cookie Consent Tool</p>
        <div>
          <p>WWe provide a simple cookie consent tool that allows you to:</p>
          <ul>
            <li className="before:content-['-'] before:mr-2">
              View all cookies in use
            </li>
            <li className="before:content-['-'] before:mr-2">
              Enable/disable non-essential cookies
            </li>
            <li className="before:content-['-'] before:mr-2">
              Update preferences at any time
            </li>
            <li className="before:content-['-'] before:mr-2">
              Access detailed cookie information
            </li>
          </ul>
        </div>
        <p>Visit our Cookie Settings page to manage your preferences.</p>
      </div>
    </div>
  );
}
