import Image from "next/image";
import { LicenseManagementType } from "../_types";

export const LicenseCard: React.FC<{ card: LicenseManagementType }> = ({
  card,
}) => {
  return (
    <div className="bg-card p-8 rounded-[20px]">
      <div className="flex gap-4 mb-9">
        <Image src={card.icon} alt="icon" width={32} height={32} />
        <div>
          <h3 className="font-semibold text-2xl md:text-[32px] md:leading-[43px]">
            {card.title}
          </h3>
          <h4 className="font-semibold text-base text-[#CBC9C9]">
            {card.description}
          </h4>
        </div>
      </div>
      <ul className="space-y-5">
        {card.actions.map((action, index) => (
          <li
            key={index}
            className="font-medium text-xl md:text-2xl text-[#EFEBEB]"
          >
            {action}
          </li>
        ))}
      </ul>
    </div>
  );
};
