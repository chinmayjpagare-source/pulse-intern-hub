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
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
      <Header onSearch={onSearch} />
      <div className="flex relative z-10">
        <Sidebar />
        <main className="flex-1 md:ml-0 p-6">
          <div className="max-w-7xl mx-auto">
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
