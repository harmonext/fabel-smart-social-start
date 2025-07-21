
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("company-profile");
  const [activeSubTab, setActiveSubTab] = useState("profile-survey");
  const { isCompleted, isLoading } = useOnboarding();
  const { isOnboarded, isLoading: companyLoading } = useCompanyDetails();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard effect - isLoading:', isLoading, 'companyLoading:', companyLoading, 'isCompleted:', isCompleted, 'isOnboarded:', isOnboarded);
    
    if (!isLoading && isCompleted === false) {
      console.log('Redirecting to onboarding - user not completed');
      navigate('/onboarding');
      return;
    }
    
    // If user has onboarded=true, force redirect to personas regardless of URL params
    if (!companyLoading && isOnboarded === true) {
      console.log('FORCING personas tab - user has onboarded=true');
      setActiveTab("company-profile");
      setActiveSubTab("personas");
      // Also update URL to reflect the change
      navigate('/dashboard?tab=company-profile&subtab=personas', { replace: true });
      return;
    }
    
    // Check URL parameters for manual navigation
    const tabParam = searchParams.get('tab');
    const subtabParam = searchParams.get('subtab');
    
    if (tabParam) {
      console.log('Setting tab from URL:', tabParam);
      setActiveTab(tabParam);
    }
    
    if (subtabParam) {
      console.log('Setting subtab from URL:', subtabParam);
      setActiveSubTab(subtabParam);
    }
    
    // Fallback: if user completed onboarding via the old logic and no specific params
    if (!isLoading && isCompleted === true && !tabParam && !subtabParam) {
      console.log('Setting personas tab - user completed onboarding (fallback)');
      setActiveTab("company-profile");
      setActiveSubTab("personas");
    }
  }, [isLoading, companyLoading, isCompleted, isOnboarded, navigate, searchParams]);

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
