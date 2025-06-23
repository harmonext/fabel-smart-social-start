
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useOnboarding } from "@/hooks/useOnboarding";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("user-profile");
  const [activeSubTab, setActiveSubTab] = useState("");
  const { isCompleted, isLoading } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isCompleted === false) {
      navigate('/onboarding');
    }
  }, [isCompleted, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isCompleted === false) {
    return null; // Will redirect to onboarding
  }

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
