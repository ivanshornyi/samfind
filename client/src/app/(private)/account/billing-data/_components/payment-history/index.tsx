interface PaymentRecord {
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "Failed" | "Paid";
  planType: string;
}

export const PaymentHistory = () => {
  const payments: PaymentRecord[] = [
    {
      invoiceNumber: "INV473824872",
      date: "02.02.2025",
      amount: 19.99,
      status: "Failed",
      planType: "Personal Standart Monthly",
    },
    {
      invoiceNumber: "INV473824872",
      date: "02.02.2025",
      amount: 19.99,
      status: "Paid",
      planType: "Personal Standart Monthly",
    },
  ];

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 text-sm text-[#C4C4C4] uppercase">
        <div>Invoice Number</div>
        <div>Invoice Date</div>
        <div>Amount</div>
        <div>Status</div>
      </div>

      {payments.map((payment, index) => (
        <div
          key={`${payment.invoiceNumber}-${payment.date}-${index}`}
          className="grid grid-cols-4 gap-4 p-4 text-sm border-t border-[#383838]"
        >
          <div>
            <div>{payment.invoiceNumber}</div>
            <div className="text-[#C4C4C4] text-xs">{payment.planType}</div>
          </div>
          <div>{payment.date}</div>
          <div>${payment.amount}</div>
          <div
            className={
              payment.status === "Failed" ? "text-[#FF6C6C]" : "text-[#4BB543]"
            }
          >
            {payment.status}
          </div>
        </div>
      ))}
    </div>
  );
};
