'use client'

import { InvestCalcPrice, InvestFAQ, InvestHero, SocialNetworks } from "./_components";

export default function Contact() {
  return (
    <>
      <InvestHero />
      <InvestCalcPrice sharePrice={1.57} />
      <InvestFAQ />
      <SocialNetworks />
    </>
  )
}
