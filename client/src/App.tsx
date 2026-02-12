import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/hooks/use-theme.tsx";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Beneficiaries = lazy(() => import("@/pages/Beneficiaries"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Contact = lazy(() => import("@/pages/Contact"));
const Donate = lazy(() => import("@/pages/Donate"));
const Volunteer = lazy(() => import("@/pages/Volunteer"));
const Login = lazy(() => import("@/pages/Login"));
const DonorLogin = lazy(() => import("@/pages/DonorLogin"));
const DonorDashboard = lazy(() => import("@/pages/DonorDashboard"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Admin = lazy(() => import("@/pages/Admin"));
const DonorsManagement = lazy(() => import("@/pages/DonorsManagement"));
const Logs = lazy(() => import("@/pages/Logs"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));

function Router() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">جارٍ التحميل…</div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/beneficiary" component={Beneficiaries} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/contact" component={Contact} />
          <Route path="/projects" component={Home} />
          <Route path="/donate" component={Donate} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/login" component={Login} />
          <Route path="/donor-login" component={DonorLogin} />
          <Route path="/donor-dashboard" component={DonorDashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
          <Route path="/donors-management" component={DonorsManagement} />
          <Route path="/logs" component={Logs} />
          <Route path="/thank-you" component={ThankYou} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <Toaster />
        <ScrollToTop />
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
