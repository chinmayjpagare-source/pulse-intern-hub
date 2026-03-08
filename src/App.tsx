import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import PageLoader from "@/components/PageLoader";

// Lazy load all pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Main = lazy(() => import("./pages/Main"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Profile = lazy(() => import("./pages/Profile"));
const Preparation = lazy(() => import("./pages/Preparation"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="internship-theme">
      <BookmarkProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/main" element={<Main />} />
                <Route path="/discover" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/preparation" element={<Preparation />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </BookmarkProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
