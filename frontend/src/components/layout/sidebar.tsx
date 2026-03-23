"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  LayoutDashboard,
  FolderOpen,
  Zap,
  Wand2,
  FileText,
  Image,
  Mic2,
  Palette,
  Film,
  Download,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const navSections = [
  {
    title: "VISÃO GERAL",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: FolderOpen, label: "Projetos", href: "/projects" },
    ],
  },
  {
    title: "PRODUÇÃO",
    items: [
      { icon: Zap, label: "Mineração", href: "/mining" },
      { icon: Wand2, label: "Mecanismo Narrativo", href: "/narrative" },
      { icon: FileText, label: "Editor de Scripts", href: "/scripts" },
    ],
  },
  {
    title: "ATIVOS",
    items: [
      { icon: Image, label: "Biblioteca de Mídia", href: "/media" },
      { icon: Mic2, label: "Studio de Voz", href: "/voice" },
      { icon: Palette, label: "Presets Visuais", href: "/presets" },
    ],
  },
  {
    title: "SAÍDA",
    items: [
      { icon: Film, label: "Timeline", href: "/timeline" },
      { icon: Download, label: "Exportar", href: "/export" },
    ],
  },
  {
    title: "SISTEMA",
    items: [{ icon: Settings, label: "Configurações", href: "/settings" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-bg-surface border-r border-border flex flex-col transition-all duration-300 z-40",
        sidebarOpen ? "w-60" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {sidebarOpen && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-glow rounded-xs flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-text-primary font-bold hidden md:inline">
              BlackTube
            </span>
          </Link>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 hover:bg-bg-surface-2 rounded-xs transition-colors text-text-secondary hover:text-text-primary"
          title={sidebarOpen ? "Recolher" : "Expandir"}
        >
          <ChevronLeft
            size={20}
            className={cn("transition-transform", !sidebarOpen && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            {sidebarOpen && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2.5 text-sm transition-all duration-200",
                      "border-l-2 border-transparent hover:border-border-active hover:bg-bg-surface-2",
                      isActive && [
                        "border-l-accent bg-bg-surface-2 text-accent",
                        "shadow-lg shadow-accent/10",
                      ],
                      !isActive && "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4 space-y-3">
        {sidebarOpen && user && (
          <div className="px-2 py-2 bg-bg-surface-2 rounded-xs">
            <p className="text-sm font-medium text-text-primary truncate">
              {user.name}
            </p>
            <p className="text-xs text-text-secondary truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-center space-x-2"
        >
          <LogOut size={16} />
          {sidebarOpen && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
