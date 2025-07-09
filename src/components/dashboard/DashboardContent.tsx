
import UserProfile from "./content/UserProfile";
import ProfileSurvey from "./content/ProfileSurvey";
import Personas from "./content/Personas";
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
        return <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h1 className="text-2xl font-bold text-foreground">Persona 1</h1>
            <p className="text-muted-foreground mt-2">Create and manage your first customer persona</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground">Persona 1 content coming soon...</p>
          </div>
        </div>;
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
