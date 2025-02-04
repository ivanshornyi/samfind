import { Button } from "@/components";
import { AppstoreImage, WindowsImage, PlaymarketImage } from "@public/images";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const items = [
  {
    imageSrc: AppstoreImage,
    name: "MacOS",
    description: "Get the Onsio App from the AppStore",
  },
  {
    imageSrc: WindowsImage,
    name: "Windows",
    description: "Get the Onsio mobile App from the GooglePlay",
  },
  {
    imageSrc: AppstoreImage,
    name: "Mobile iOS",
    description: "Get the Onsio mobile App from the AppStore",
  },
  {
    imageSrc: PlaymarketImage,
    name: "Mobile Android",
    description: "Get the Onsio mobile App from the GooglePlay",
  },
];

export default function DownloadSoftware() {
  return (
    <div className="w-full space-y-6 sm:space-y-[68px] py-14">
      <h1 className="font-semibold text-[24px] leading-[32px] sm:text-[32px] sm:leading-[43px] text-start sm:text-center">
        Download and install our Software
      </h1>

      <div className="w-full flex flex-wrap justify-between gap-[10px] sm:gap-8">
        {items.map((item) => (
          <div
            key={item.name}
            className="space-y-4 w-full max-w-full sm:max-w-[285px] py-4 sm:py-0"
          >
            <Image src={item.imageSrc} alt="" />
            <h2 className="font-semibold text-[32px] leading-[43px]">
              {item.name}
            </h2>
            <h3 className="font-normal text-base">{item.description}</h3>

            <Button
              variant="link"
              className="w-full h-[60px] justify-start p-0 m-0 mt-4 relative"
              rightIcon={
                <ArrowUpRight
                  className="absolute top-0 right-0"
                  style={{ width: "24px", height: "24px" }}
                />
              }
            >
              Download now
            </Button>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <button className="font-normal text-base text-[#A8A8A8]">
          I&apos;ll do that later
        </button>
      </div>
    </div>
  );
}
