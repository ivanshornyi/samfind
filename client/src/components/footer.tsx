"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Input } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="text-white py-10 pb-[60px] px-6 text-nowrap">
      <div className="mx-auto flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex flex-col space-y-[30px] lg:space-y-[122px]">
          <Link href="/">
            <Image src="/Logo.png" width={110} height={30} alt="" />
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
              className="py-[22.5px] rounded-[30px] border-none w-full"
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
          {/* Menu */}
          <div className="space-y-[28px]">
            <h3 className="text-xl font-semibold">Menu</h3>
            <div className="flex flex-col gap-[21px] text-sm lg:text-base font-semibold">
              {[
                "Pricing",
                "About",
                "FAQ",
                "Contact",
                "Linkcense Management",
              ].map((item) => (
                <Link
                  href="/"
                  key={item}
                  className="transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5]"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Legals */}
          <div className="space-y-[28px]">
            <h3 className="text-xl font-semibold">Legals</h3>
            <div className="flex flex-col gap-[21px] text-sm lg:text-base font-semibold">
              {["Privacy Policy", "Terms of use", "Cookie Policy"].map(
                (item) => (
                  <Link
                    href="/"
                    key={item}
                    className="transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5]"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

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
          <div className="text-sm text-[#616161] flex space-x-2  overflow-x-scroll no-scrollbar">
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
