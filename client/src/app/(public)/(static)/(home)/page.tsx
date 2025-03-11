"use client";

import {
  Features,
  Intro,
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
      <Features />
      <MobileApp />
      <Software />
      <WebPlatform />
      <LicensingOptionList />
      <BeginJourney />
    </div>
  );
}
