import {
  BeginJourney,
  Features,
  Intro,
  LicensingOptionList,
} from "@app/(home)/_components";

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
