"use client";

import { Card } from "@/components";
import { PaymentsModal } from "./_components";

const items = [
  {
    name: "License",
    amount: 100,
  },
];

export default function Products() {
  return (
    <div className="container mx-auto">
      <p>Products list</p>

      {items.map((item) => (
        <Card
          key={Math.random()}
          className="w-[200px] min-h-[260px] p-2 mt-5 relative flex flex-col justify-end"
        >
          <p className="block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
            {item.name}
          </p>

          <div>
            <PaymentsModal
              amount={item.amount}
              currency="USD"
              license={{ name: item.name }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
