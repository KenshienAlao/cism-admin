"use client"
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";
import { VALUES } from "@/config/app.config";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { StallManagement } from "@/components/stallmanagement";
import { StallOverview } from "@/components/stalloverview";

export default function Home() {
  const [currentView, setCurrentView] = useState<(typeof VALUES)[keyof typeof VALUES]>(VALUES.DASHBOARD)

  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        {currentView === VALUES.DASHBOARD && <Dashboard />}
        {currentView === VALUES.MANAGE_STALLS && <StallManagement />}
        {currentView === VALUES.STALL_OVERVIEW && <StallOverview />}
      </div>
    </div>
  );
} 
