import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

const Layout = ({ children, onSearch }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onSearch={onSearch} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;