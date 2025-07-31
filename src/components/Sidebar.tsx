import { NavLink } from "react-router-dom";
import {
  User,
  Compass,
  BookOpen,
  Bookmark,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Discover Internships", url: "/discover", icon: Compass },
  { title: "Preparation", url: "/preparation", icon: BookOpen },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
  { title: "Settings", url: "/settings", icon: Settings },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobile}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen bg-card border-r border-border z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Toggle */}
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden md:flex w-full justify-start"
            >
              <Menu className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Menu</span>}
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-foreground hover:text-foreground"
                      }`
                    }
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isCollapsed ? "mx-auto" : "mr-3"
                      } transition-transform group-hover:scale-110`}
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-medium truncate">
                        {item.title}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;