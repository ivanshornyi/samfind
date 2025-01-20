"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Input } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="font-manrope text-white py-10 px-6">
      <div className="mx-auto flex flex-row justify-between">
        <div className="flex flex-col space-y-2">
          <Link href="/">
            <Image src="/Logo.png" width={110} height={30} alt="" />
          </Link>
          <p className="font-normal text-sm text-[#E6E6E6]">
            © Onsio2025. All rights reserved.
          </p>
        </div>

        {/* Menu */}
        <div className="space-y-[28px]">
          <h3 className="text-xl font-semibold">Menu</h3>
          <div className="flex flex-col gap-[21px] text-base font-semibold">
            <Link href="/">Pricing</Link>
            <Link href="/">About</Link>
            <Link href="/">FAQ</Link>
            <Link href="/">Contact</Link>
            <Link href="/">Linkcense Management</Link>
          </div>
        </div>

        {/* Legals */}
        <div className="space-y-[28px]">
          <h3 className="text-xl font-semibold">Legals</h3>
          <div className="flex flex-col gap-[21px] text-base font-semibold">
            <Link href="/">Privacy Policy</Link>
            <Link href="/">Terms of use</Link>
            <Link href="/">Cookie Policy</Link>
          </div>
        </div>

        {/* Stay Updated */}
        <div className="w-full max-w-[608px] space-y-4">
          <h3 className="text-2xl font-bold">Stay Updated.</h3>
          <p className="text-sm text-[#E6E6E6]">
            Join our community of innovators
          </p>
          <form className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="px-6 h-[44px] rounded-[30px]"
            />
            <Button
              type="submit"
              variant="ghost"
              className="h-[44px] w-[200px] rounded-[30px]"
              //   className="px-4 py-2 text-sm font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
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
          <div className="text-sm text-[#616161] flex space-x-2">
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
