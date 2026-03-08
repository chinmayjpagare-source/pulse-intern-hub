import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  mainScrollable?: boolean;
  contentClassName?: string;
}

const Layout = ({ children, onSearch, mainScrollable = true, contentClassName = "" }: LayoutProps) => {
  return (
    <div className="h-screen bg-gradient-subtle relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
      <Header onSearch={onSearch} />
      <div className="flex flex-1 relative z-10 min-h-0">
        <Sidebar />
        <main className={`flex-1 md:ml-0 ${mainScrollable ? "overflow-y-auto" : "overflow-hidden"}`}>
          <div className={`max-w-7xl mx-auto p-6 h-full min-h-0 w-full ${contentClassName}`}>
            <PageTransition className="h-full min-h-0">
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
