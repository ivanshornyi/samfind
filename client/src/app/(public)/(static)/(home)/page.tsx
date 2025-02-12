"use client";

import {
  BeginJourney,
  Features,
  Intro,
  LicensingOptionList,
} from "./_components";

export default function Main() {
  return (
    <div>
      <Intro />
      <Features />
      <BeginJourney />
      <LicensingOptionList />
    </div>
  );
}
