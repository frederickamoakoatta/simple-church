"use client";

import { useState, type ReactNode } from "react";
import Backdrop from "./Backdrop";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function handleToggleSidebar() {
    if (window.innerWidth < 1024) {
      setIsMobileOpen((open) => !open);
      return;
    }

    setIsExpanded((expanded) => !expanded);
    setIsHovered(false);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
        onHoverChange={setIsHovered}
        onNavigate={() => setIsMobileOpen(false)}
      />

      <Backdrop
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <Header
          isMobileOpen={isMobileOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="mx-auto flex min-h-0 w-full max-w-(--breakpoint-2xl) flex-1 flex-col overflow-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
