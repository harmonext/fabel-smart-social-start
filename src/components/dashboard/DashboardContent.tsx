
import UserProfile from "./content/UserProfile";
import ProfileSurvey from "./content/ProfileSurvey";
import Personas from "./content/Personas";
import SocialConnections from "./content/SocialConnections";
import ContentScheduling from "./content/ContentScheduling";
import DashboardSettings from "./content/DashboardSettings";
import SystemPromptTemplates from "./content/SystemPromptTemplates";
import PromptTemplateTypes from "./content/PromptTemplateTypes";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import OnboardedData from "./content/OnboardedData";
import RoleProtectedComponent from "@/components/RoleProtectedComponent";
import AdminContentModeration from "./content/AdminContentModeration";
import { PlatformRulesWrapper } from "./content/PlatformRulesWrapper";
import { useOnboarding } from "@/hooks/useOnboarding";
import CompanyDashboard from "./content/CompanyDashboard";

interface DashboardContentProps {
  activeTab: string;
  activeSubTab: string;
}

const DashboardContent = ({ activeTab, activeSubTab }: DashboardContentProps) => {
  const { isCompleted: onboardingCompleted } = useOnboarding();
  
  const renderContent = () => {
    if (activeTab === "company-profile") {
      if (activeSubTab === "dashboard") {
        return <CompanyDashboard />;
      }
      if (activeSubTab === "personas") {
        return <Personas />;
      }
      return <CompanyDashboard />; // Default to dashboard
    }
    
    if (activeTab === "content-management") {
      if (activeSubTab === "social-connections") {
        return <SocialConnections />;
      }
      if (activeSubTab === "content-scheduling") {
        return <ContentScheduling />;
      }
      return <SocialConnections />; // Default to social connections
    }
    
    
    if (activeTab === "system-management") {
      if (activeSubTab === "content-moderation") {
        return (
          <RoleProtectedComponent requiredRole="super_admin">
            <AdminContentModeration />
          </RoleProtectedComponent>
        );
      }
      if (activeSubTab === "prompt-template-types") {
        return (
          <RoleProtectedComponent requiredRole="super_admin">
            <PromptTemplateTypes />
          </RoleProtectedComponent>
        );
      }
      if (activeSubTab === "system-prompt-templates") {
        return (
          <RoleProtectedComponent requiredRole="super_admin">
            <SystemPromptTemplates />
          </RoleProtectedComponent>
        );
      }
      if (activeSubTab === "platform-rules") {
        return (
          <RoleProtectedComponent requiredRole="super_admin">
            <PlatformRulesWrapper />
          </RoleProtectedComponent>
        );
      }
      return (
        <RoleProtectedComponent requiredRole="super_admin">
          <AdminContentModeration />
        </RoleProtectedComponent>
      ); // Default to content moderation
    }
    
    if (activeTab === "settings") {
      if (activeSubTab === "user-profile") {
        return <UserProfile />;
      }
      if (activeSubTab === "profile-survey") {
        return <ProfileSurvey />;
      }
      if (activeSubTab === "onboarding") {
        return onboardingCompleted ? <OnboardedData /> : <OnboardingFlow />;
      }
      if (activeSubTab === "preferences") {
        return <DashboardSettings />;
      }
      return <UserProfile />; // Default to user profile
    }
    
    return <Personas />; // Default fallback
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
