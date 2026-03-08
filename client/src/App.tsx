import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/hooks/use-theme.tsx";
import { CartProvider } from "@/hooks/use-cart";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Beneficiaries = lazy(() => import("@/pages/Beneficiaries"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Contact = lazy(() => import("@/pages/Contact"));
const Donate = lazy(() => import("@/pages/Donate"));
const Login = lazy(() => import("@/pages/Login"));
const DonorLogin = lazy(() => import("@/pages/DonorLogin"));
const DonorDashboard = lazy(() => import("@/pages/DonorDashboard"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Admin = lazy(() => import("@/pages/Admin"));
const DonorsManagement = lazy(() => import("@/pages/DonorsManagement"));
const Logs = lazy(() => import("@/pages/Logs"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
// من نحن
const Members = lazy(() => import("@/pages/Members"));
const Governance = lazy(() => import("@/pages/Governance"));
const Awards = lazy(() => import("@/pages/Awards"));
const DirectorContact = lazy(() => import("@/pages/DirectorContact"));
const DonationMethods = lazy(() => import("@/pages/DonationMethods"));
const BankAccounts = lazy(() => import("@/pages/BankAccounts"));
// البرامج
const ProgramsTreatment = lazy(() => import("@/pages/ProgramsTreatment"));
const ProgramsAwareness = lazy(() => import("@/pages/ProgramsAwareness"));
// المركز التطوعي
const VolunteerForm = lazy(() => import("@/pages/VolunteerForm"));
const HealthPlatform = lazy(() => import("@/pages/HealthPlatform"));
const DonationPlatform = lazy(() => import("@/pages/DonationPlatform"));
const VolunteerReports = lazy(() => import("@/pages/VolunteerReports"));
// المركز الإعلامي
const MediaLibrary = lazy(() => import("@/pages/MediaLibrary"));
const News = lazy(() => import("@/pages/News"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const Announcements = lazy(() => import("@/pages/Announcements"));
const SmileStory = lazy(() => import("@/pages/SmileStory"));
const MediaReports = lazy(() => import("@/pages/MediaReports"));
// خيارات التبرع
const RecurringDonate = lazy(() => import("@/pages/RecurringDonate"));
const TributeDonate = lazy(() => import("@/pages/TributeDonate"));
const CampaignDonate = lazy(() => import("@/pages/CampaignDonate"));
const DonationOpportunities = lazy(() => import("@/pages/DonationOpportunities"));
const DonationOpportunityDetails = lazy(() => import("@/pages/DonationOpportunityDetails"));
const Cart = lazy(() => import("@/pages/Cart"));

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
          <Route path="/login" component={Login} />
          <Route path="/donor-login" component={DonorLogin} />
          <Route path="/donor-dashboard" component={DonorDashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
          <Route path="/donors-management" component={DonorsManagement} />
          <Route path="/logs" component={Logs} />
          <Route path="/thank-you" component={ThankYou} />
          
          {/* من نحن routes */}
          <Route path="/members" component={Members} />
          <Route path="/governance" component={Governance} />
          <Route path="/awards" component={Awards} />
          <Route path="/director-contact" component={DirectorContact} />
          <Route path="/donation-methods" component={DonationMethods} />
          <Route path="/bank-accounts" component={BankAccounts} />
          
          {/* البرامج routes */}
          <Route path="/programs/treatment" component={ProgramsTreatment} />
          <Route path="/programs/awareness" component={ProgramsAwareness} />
          
          {/* المركز التطوعي routes */}
          <Route path="/volunteer/form" component={VolunteerForm} />
          <Route path="/volunteer/health-platform" component={HealthPlatform} />
          <Route path="/volunteer/donation-platform" component={DonationPlatform} />
          <Route path="/volunteer/reports" component={VolunteerReports} />
          
          {/* المركز الإعلامي routes */}
          <Route path="/media/library" component={MediaLibrary} />
          <Route path="/media/news" component={News} />
          <Route path="/media/testimonials" component={Testimonials} />
          <Route path="/media/announcements" component={Announcements} />
          <Route path="/media/smile-story" component={SmileStory} />
          <Route path="/media/reports" component={MediaReports} />
          
          {/* خيارات التبرع routes */}
          <Route path="/donate/recurring" component={RecurringDonate} />
          <Route path="/donate/tribute" component={TributeDonate} />
          <Route path="/donate/campaign" component={CampaignDonate} />
          <Route path="/donate/opportunities/:id" component={DonationOpportunityDetails} />
          <Route path="/donate/opportunities" component={DonationOpportunities} />
          <Route path="/cart" component={Cart} />
          
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
        <CartProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
