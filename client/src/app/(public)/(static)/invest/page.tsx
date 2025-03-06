'use client'

import { InvestCalcPrice, InvestHero, Office, SocialNetworks } from "./_components";

export default function Contact() {
  return (
    <>
      <InvestHero />
      <InvestCalcPrice sharePrice={1.57} />
      {/* <Office />
      <SocialNetworks /> */}
    </>
  )
}
