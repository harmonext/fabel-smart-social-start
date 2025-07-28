
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
import { useOnboarding } from "@/hooks/useOnboarding";

interface DashboardContentProps {
  activeTab: string;
  activeSubTab: string;
}

const DashboardContent = ({ activeTab, activeSubTab }: DashboardContentProps) => {
  const { isCompleted: onboardingCompleted } = useOnboarding();
  
  const renderContent = () => {
    if (activeTab === "user-profile") {
      return <UserProfile />;
    }
    
    if (activeTab === "company-profile") {
      if (activeSubTab === "profile-survey") {
        return <ProfileSurvey />;
      }
      if (activeSubTab === "onboarding") {
        return onboardingCompleted ? <OnboardedData /> : <OnboardingFlow />;
      }
      if (activeSubTab === "personas") {
        return <Personas />;
      }
      return <ProfileSurvey />; // Default to profile survey
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
    
    
    if (activeTab === "settings") {
      return <DashboardSettings />;
    }
    
    return <UserProfile />; // Default fallback
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
