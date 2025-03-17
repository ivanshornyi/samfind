"use client";

import { Button, Input } from "@/components/ui";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  Youtube,
} from "@public/contact/icons";
import { Logo } from "@public/images";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Link = {
  label: string;
  href: string;
};

const links: { menu: Link[]; legals: Link[]; system: Link[]; info: Link[] } = {
  menu: [
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/about" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
    { label: "License Management", href: "/license-management" },
  ],
  legals: [
    { label: "Privacy Policy", href: "/policy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookie" },
  ],
  system: [
    { label: "Onsio App", href: "/" },
    { label: "Onsio Software", href: "/" },
  ],
  info: [
    { label: "Privacy Policy", href: "/policy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookie" },
  ],
};

const networks = [
  {
    name: "Youtube:",
    icon: Youtube,
    link: "https://youtube.com/@OnsioAi",
  },
  {
    name: "Twitter:",
    icon: Twitter,
    link: "https://x.com/OnsioAI",
  },
  {
    name: "Facebook:",
    icon: Facebook,
    link: "https://www.facebook.com/people/Onsio/61572172265173",
  },
  {
    name: "Instagram:",
    icon: Instagram,
    link: "https://instagram.com/onsiotech",
  },
  {
    name: "LinkedIn:",
    icon: LinkedIn,
    link: "https://linkedin.com/company/onsio/about",
  },
];

const FooterNetworks = () => {
  return (
    <div className="z-10 mt-[40px] sm:mt-0 flex gap-[24px] items-center max-w-full sm:max-w-[360px] ml-auto mr-auto sm:mx-0">
      {networks.map((n) => (
        <a
          key={n.name}
          href={n.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-[10px] sm:p-[6px] w-[44px] h-[44px] lg:w-[30px] lg:h-[30px]"
        >
          <Image src={n.icon} alt={n.name} width={24} height={24} />
        </a>
      ))}
    </div>
  );
};

const FooterSection = ({ title, links }: { title: string; links: Link[] }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    if (href === "/#pricing") {
      if (pathname === "/") {
        document
          .getElementById("pricing")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
      return;
    }
    router.push(href);
  };

  return (
    <div className="space-y-[28px]">
      {/* <h3 className="text-xl font-semibold">{title}</h3> */}
      <div className="flex flex-col gap-[21px] text-sm lg:text-base font-semibold">
        {links.map((item, index) => (
          <span
            key={index}
            onClick={() => handleNavigation(item.href)}
            className="transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5] cursor-pointer"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <footer className="text-white py-[14px] sm:py-10 sm:pb-[60px] px-5 sm:px-6 text-nowrap relative overflow-hidden">
      {pathname !== "/" && (
        <div
          aria-label="bg-footer-ball"
          className="absolute z-[-1] top-[28%] left-[25%] w-[800px] h-[827px] rounded-[830px] bg-customBoulderBallPinkBGRGBA blur-customBoulderBallPinkBGRGBA"
        />
      )}
      <div className="mx-auto flex flex-col lg:flex-row gap-10 justify-between">
        <div className="flex flex-col lg:block space-y-[30px] lg:space-y-[122px]">
          <div
            onClick={() => router.push("/")}
            className="z-1000 cursor-pointer"
          >
            <Image src={Logo} width={110} height={28} alt="logo" />
          </div>
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
              className="rounded-[30px] border-none w-full mb-6"
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
          <div
            style={{ margin: 0 }}
            className="hidden  lg:flex flex-col justify-between max-h-[230px] pt-[36px] h-[100%]"
          >
            <FooterNetworks />
            <p className="font-normal text-sm text-[#E6E6E6] ">
              © Onsio2025. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-row xl:gap-12">
          <FooterSection title="Menu" links={links.menu} />
          <FooterSection title="System" links={links.system} />
          <FooterSection title="Info" links={links.info} />
          {/* <FooterSection title="Legals" links={links.legals} /> */}
        </div>

        <div className="lg:hidden flex flex-col justify-between maw-w-[360px]">
          <FooterNetworks />
          <p className="font-normal text-sm text-[#E6E6E6] mt-[30px]">
            © Onsio2025. All rights reserved.
          </p>
        </div>

        {/* Stay Updated */}
        {/* <div className="w-full lg:max-w-[400px] xl:max-w-[608px] space-y-4 hidden lg:block">
          <h3 className="text-2xl font-bold">Stay Updated.</h3>
          <p className="text-sm text-[#E6E6E6]">
            Join our community of innovators
          </p>
          <form className="flex">
            <Input type="email" placeholder="Enter your email address" />
            <Button
              type="submit"
              variant="secondary"
              className="w-fit rounded-[30px] border-none"
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
        </div> */}
      </div>
    </footer>
  );
};
