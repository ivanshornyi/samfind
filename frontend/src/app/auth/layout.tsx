import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-5 md:px-0">
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
};