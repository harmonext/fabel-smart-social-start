
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  User, 
  Building2, 
  FileText, 
  Users, 
  Calendar, 
  Share2, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  activeTab: string;
  activeSubTab: string;
  setActiveTab: (tab: string) => void;
  setActiveSubTab: (subTab: string) => void;
}

const DashboardSidebar = ({ 
  activeTab, 
  activeSubTab, 
  setActiveTab, 
  setActiveSubTab 
}: DashboardSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["company-profile", "content-management", "personas"]);
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleTabClick = (tabId: string, subTabId?: string) => {
    setActiveTab(tabId);
    if (subTabId) {
      setActiveSubTab(subTabId);
    } else {
      setActiveSubTab("");
    }
  };

  const handleLogout = () => {
    // TODO: Add actual logout logic here when authentication is implemented
    console.log("User logged out");
    navigate("/");
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-fabel-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-foreground">Fabel</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent className="px-4">
        <nav className="space-y-2">
          {/* User Profile */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left h-10",
              activeTab === "user-profile" && "bg-fabel-primary/10 text-fabel-primary"
            )}
            onClick={() => handleTabClick("user-profile")}
          >
            <User className="h-4 w-4 mr-3" />
            User Profile
          </Button>

          {/* Company Profile */}
          <div>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between text-left h-10",
                activeTab === "company-profile" && "bg-fabel-primary/10 text-fabel-primary"
              )}
              onClick={() => toggleSection("company-profile")}
            >
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-3" />
                Company Profile
              </div>
              {isExpanded("company-profile") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isExpanded("company-profile") && (
              <div className="ml-7 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-9 text-sm",
                    activeTab === "company-profile" && activeSubTab === "profile-survey" && "bg-fabel-primary/10 text-fabel-primary"
                  )}
                  onClick={() => handleTabClick("company-profile", "profile-survey")}
                >
                  <FileText className="h-3 w-3 mr-3" />
                  Company
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-9 text-sm",
                    activeTab === "company-profile" && activeSubTab === "onboarding" && "bg-fabel-primary/10 text-fabel-primary"
                  )}
                  onClick={() => handleTabClick("company-profile", "onboarding")}
                >
                  <ClipboardList className="h-3 w-3 mr-3" />
                  Onboarding
                </Button>
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-left h-9 text-sm",
                      activeTab === "company-profile" && (activeSubTab === "personas" || activeSubTab === "persona-1" || activeSubTab === "persona-2" || activeSubTab === "persona-3") && "bg-fabel-primary/10 text-fabel-primary"
                    )}
                    onClick={() => toggleSection("personas")}
                  >
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-3" />
                      Personas
                    </div>
                    {isExpanded("personas") ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                  
                  {isExpanded("personas") && (
                    <div className="ml-7 mt-1 space-y-1">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left h-8 text-xs",
                          activeTab === "company-profile" && activeSubTab === "persona-1" && "bg-fabel-primary/10 text-fabel-primary"
                        )}
                        onClick={() => handleTabClick("company-profile", "persona-1")}
                      >
                        <User className="h-3 w-3 mr-3" />
                        Persona 1
                      </Button>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left h-8 text-xs",
                          activeTab === "company-profile" && activeSubTab === "persona-2" && "bg-fabel-primary/10 text-fabel-primary"
                        )}
                        onClick={() => handleTabClick("company-profile", "persona-2")}
                      >
                        <User className="h-3 w-3 mr-3" />
                        Persona 2
                      </Button>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left h-8 text-xs",
                          activeTab === "company-profile" && activeSubTab === "persona-3" && "bg-fabel-primary/10 text-fabel-primary"
                        )}
                        onClick={() => handleTabClick("company-profile", "persona-3")}
                      >
                        <User className="h-3 w-3 mr-3" />
                        Persona 3
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Management */}
          <div>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between text-left h-10",
                activeTab === "content-management" && "bg-fabel-primary/10 text-fabel-primary"
              )}
              onClick={() => toggleSection("content-management")}
            >
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3" />
                Content Management
              </div>
              {isExpanded("content-management") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isExpanded("content-management") && (
              <div className="ml-7 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-9 text-sm",
                    activeTab === "content-management" && activeSubTab === "social-connections" && "bg-fabel-primary/10 text-fabel-primary"
                  )}
                  onClick={() => handleTabClick("content-management", "social-connections")}
                >
                  <Share2 className="h-3 w-3 mr-3" />
                  Social Connections
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-9 text-sm",
                    activeTab === "content-management" && activeSubTab === "content-scheduling" && "bg-fabel-primary/10 text-fabel-primary"
                  )}
                  onClick={() => handleTabClick("content-management", "content-scheduling")}
                >
                  <Calendar className="h-3 w-3 mr-3" />
                  Content Scheduling
                </Button>
              </div>
            )}
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left h-10",
              activeTab === "settings" && "bg-fabel-primary/10 text-fabel-primary"
            )}
            onClick={() => handleTabClick("settings")}
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-left h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
