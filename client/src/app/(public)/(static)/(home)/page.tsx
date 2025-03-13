"use client";

import {
  Features,
  Intro,
  Solutoins,
  MobileApp,
  Software,
  WebPlatform,
  LicensingOptionList,
  BeginJourney,
} from "./_components";

export default function Main() {
  return (
    <div>
      <Intro />
      <Solutoins />
      <Features />
      <MobileApp />
      <Software />
      <WebPlatform />
      <LicensingOptionList />
      <BeginJourney />
    </div>
  );
}
