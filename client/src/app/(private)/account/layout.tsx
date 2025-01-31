"use client";

import React from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto w-full">{children}</div>;
}
