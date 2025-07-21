
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useOnboarding } from "@/hooks/useOnboarding";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("company-profile");
  const [activeSubTab, setActiveSubTab] = useState("profile-survey");
  const { isCompleted, isLoading } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isCompleted === false) {
      navigate('/onboarding');
    } else if (!isLoading && isCompleted === true) {
      // Always take completed users to personas tab
      setActiveTab("company-profile");
      setActiveSubTab("personas");
    }
  }, [isCompleted, isLoading, navigate]);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const subtabParam = searchParams.get('subtab');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (subtabParam) {
      setActiveSubTab(subtabParam);
    }
  }, [searchParams]);

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
