import React from "react";
import { checkUser } from "@/lib/checkUser";

export default async function MainLayout({ children }) {
  await checkUser();

  return (
    <div className="container mx-auto mt-24 mb-20">
      {children}
    </div>
  );
}