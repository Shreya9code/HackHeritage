import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
import "./App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Schedule from "./pages/Schedule";
import Compliance from "./pages/Compliance";
import QRGenerator from "./pages/QRGenerator";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";
import ContactUs from "./pages/ContactUs";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          {/* Home page - no sidebar, with header and footer */}
          <Route path="/" element={<Home />} />
          
          {/* Auth pages - no layout */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected pages - with layout */}
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

function ProtectedLayout() {
  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content relative z-10 flex flex-1 flex-col md:ml-64">
        <Header onMenuToggle={() => {}} />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="rounded-2xl border border-emerald-100/60 !bg-white/70 shadow-lg backdrop-blur">
              <main className="p-6 md:p-8">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/qr-generator" element={<QRGenerator />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/contact" element={<ContactUs />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;