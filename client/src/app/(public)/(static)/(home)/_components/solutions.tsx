import { Button } from "@/components";
import { SolutionsImage } from "@public/home";
import Image from "next/image";
import Link from "next/link";

export const Solutoins = () => {
  return (
    <div className="items-center gap-[100px] grid grid-cols-1 sm:grid-cols-2 ">
      <Image src={SolutionsImage} width={600} height={763} alt="solutoins" />
      <div className="flex flex-col">
        <h2 className="font-bold text-[40px] leading-[120%]">
          Whether you’re an individual or a business, Onsio empowers you with
          smart, privacy-first solutions for navigating the digital world.
        </h2>
        <h3 className="font-normal text-base mt-6">
          We believe that privacy shouldn’t come at the cost of powerful,
          intelligent tools. Onsio is your trusted partner in unlocking new
          possibilities for research, content generation, and data management,
          all while protecting your digital identity.
        </h3>
        <div className="flex items-center gap-[6px] mt-[48px]">
          <Button variant="secondary" className="w-full max-w-[200px]">
            Sign up
          </Button>
          <Link href="/learn-more/mobile-app">
            <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium">
              <span>Learn More</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
