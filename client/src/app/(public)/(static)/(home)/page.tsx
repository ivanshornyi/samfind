"use client";

import { useContext } from "react";

import { AuthContext } from "@/context";

import {
  BeginJourney,
  Features,
  Intro,
  LicensingOptionList,
} from "./_components";

export default function Main() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Intro />
      <Features />
      <BeginJourney />
      {!user && <LicensingOptionList />}
    </div>
  );
}
