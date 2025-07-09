
import UserProfile from "./content/UserProfile";
import ProfileSurvey from "./content/ProfileSurvey";
import Personas from "./content/Personas";
import Persona1 from "./content/Persona1";
import Persona2 from "./content/Persona2";
import Persona3 from "./content/Persona3";
import SocialConnections from "./content/SocialConnections";
import ContentScheduling from "./content/ContentScheduling";
import DashboardSettings from "./content/DashboardSettings";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

interface DashboardContentProps {
  activeTab: string;
  activeSubTab: string;
}

const DashboardContent = ({ activeTab, activeSubTab }: DashboardContentProps) => {
  const renderContent = () => {
    if (activeTab === "user-profile") {
      return <UserProfile />;
    }
    
    if (activeTab === "company-profile") {
      if (activeSubTab === "profile-survey") {
        return <ProfileSurvey />;
      }
      if (activeSubTab === "onboarding") {
        return <OnboardingFlow />;
      }
      if (activeSubTab === "personas") {
        return <Personas />;
      }
      if (activeSubTab === "persona-1") {
        return <Persona1 />;
      }
      if (activeSubTab === "persona-2") {
        return <Persona2 />;
      }
      if (activeSubTab === "persona-3") {
        return <Persona3 />;
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
