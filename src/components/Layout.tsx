import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

const Layout = ({ children, onSearch }: LayoutProps) => {
  return (
    <div className="h-screen bg-gradient-subtle relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
      <Header onSearch={onSearch} />
      <div className="flex flex-1 relative z-10 min-h-0">
        <Sidebar />
        <main className="flex-1 md:ml-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
