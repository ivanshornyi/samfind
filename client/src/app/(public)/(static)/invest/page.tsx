"use client";

import { useGetAppSharePrice } from "@/hooks";
import {
  InvestCalcPrice,
  InvestFAQ,
  InvestHero,
  SocialNetworks,
} from "./_components";

export default function Contact() {
  const { data } = useGetAppSharePrice();
  return (
    <>
      <InvestHero />
      <InvestCalcPrice sharePrice={(data?.sharePrice || 0) / 100} />
      <InvestFAQ />
      <SocialNetworks />
    </>
  );
}
