"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "ml-60" : "ml-20"
        )}
      >
        <Header />
        <main className="flex-1 overflow-auto mt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
