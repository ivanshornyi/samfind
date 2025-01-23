"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Input } from "@/components/ui";
import { Logo } from "@public/images";

type Link = {
  label: string;
  href: string;
};

const links: { menu: Link[]; legals: Link[] } = {
  menu: [
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "License Management", href: "/license-management" },
  ],
  legals: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const FooterSection = ({ title, links }: { title: string; links: Link[] }) => (
  <div className="space-y-[28px]">
    <h3 className="text-xl font-semibold">{title}</h3>
    <div className="flex flex-col gap-[21px] text-sm lg:text-base font-semibold">
      {links.map((item, index) => (
        <Link
          href="/"
          key={index}
          className="transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  </div>
);

export const Footer = () => {
  return (
    <footer className="text-white py-[14px] sm:py-10 sm:pb-[60px] px-5 sm:px-6 text-nowrap">
      <div className="mx-auto flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex flex-col space-y-[30px] lg:space-y-[122px]">
          <Link href="/">
            <Image src={Logo} width={110} height={28} alt="" />
          </Link>
          <div className="lg:hidden">
            <h3 className="text-xl font-bold mb-2">Stay Updated.</h3>
            <p className="text-base text-[#E6E6E6] mb-6">
              Join our community of innovators
            </p>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="mb-2"
            />
            <p className="text-sm text-[#E6E6E6] mb-6">
              By submitting this form you agree to our{" "}
              <Link href="/privacy" className="underline">
                Privacy policy
              </Link>
            </p>
            <Button
              type="submit"
              variant="secondary"
              className="py-[22.5px] rounded-[30px] border-none w-full mb-6"
            >
              Subscribe now
            </Button>
            <div className="text-sm text-[#616161] flex sm:justify-center space-x-2 overflow-x-scroll no-scrollbar">
              <span>• Latest updates</span>
              <span>• Technology insights</span>
              <span>• Success stories</span>
              <span>• Community highlights</span>
            </div>
          </div>
          <p className="font-normal text-sm text-[#E6E6E6] hidden lg:block">
            © Onsio2025. All rights reserved.
          </p>
        </div>

        <div className="flex flex-row xl:gap-12">
          <FooterSection title="Menu" links={links.menu} />
          <FooterSection title="Legals" links={links.legals} />
        </div>

        <p className="lg:hidden font-normal text-sm text-[#E6E6E6]">
          © Onsio2025. All rights reserved.
        </p>

        {/* Stay Updated */}
        <div className="w-full lg:max-w-[400px] xl:max-w-[608px] space-y-4 hidden lg:block">
          <h3 className="text-2xl font-bold">Stay Updated.</h3>
          <p className="text-sm text-[#E6E6E6]">
            Join our community of innovators
          </p>
          <form className="flex">
            <Input type="email" placeholder="Enter your email address" />
            <Button
              type="submit"
              variant="secondary"
              className="py-[22.5px] w-fit rounded-[30px] border-none"
            >
              Subscribe now
            </Button>
          </form>
          <p className="text-sm text-[#E6E6E6]">
            By submitting this form you agree to our{" "}
            <Link href="/privacy" className="underline">
              Privacy policy
            </Link>
          </p>
          <div className="text-sm text-[#616161] flex space-x-2 overflow-x-scroll no-scrollbar">
            <span>• Latest updates</span>
            <span>• Technology insights</span>
            <span>• Success stories</span>
            <span>• Community highlights</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
