
import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("user-profile");
  const [activeSubTab, setActiveSubTab] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar 
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveTab={setActiveTab}
          setActiveSubTab={setActiveSubTab}
        />
        <main className="flex-1 overflow-auto">
          <DashboardContent 
            activeTab={activeTab}
            activeSubTab={activeSubTab}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
