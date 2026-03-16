import React from "react";
import { checkUser } from "@/lib/checkUser";

export default async function MainLayout({ children }) {
  await checkUser();

  return (
    <main className="min-h-screen w-full overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto mt-24 mb-20">
        {children}
      </div>
    </main>
  );
}