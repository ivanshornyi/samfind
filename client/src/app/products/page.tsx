"use client";

import { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { Card } from "@/components";
import { PaymentsModal } from "./_components";

const items = [
  {
    name: "License 1",
    amount: 100,
    key: "key 1",
  },
];

export default function Products() {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(searchParams.get("redirect_status"));
  }, [searchParams]);

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
            <p className="text-center mb-2">$10.99</p>
            <PaymentsModal
              amount={item.amount}
              currency="USD"
              license={{ name: item.name, key: item.key }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
