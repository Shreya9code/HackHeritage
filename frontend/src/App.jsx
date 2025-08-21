import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
import "./App.css";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Schedule from "./pages/Schedule";
import Compliance from "./pages/Compliance";
import QRGenerator from "./pages/QRGenerator";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className="relative flex min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="main-content relative z-10 flex flex-1 flex-col md:ml-64">
            <Header />
            <div className="flex-1 p-6">
              <div className="mx-auto max-w-7xl space-y-6">
                <div className="rounded-2xl border border-emerald-100/60 bg-white/70 shadow-lg backdrop-blur">
                  <main className="p-6 md:p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/compliance" element={<Compliance />} />
                      <Route path="/qr-generator" element={<QRGenerator />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/campaigns" element={<Campaigns />} />
                      <Route path="/signin" element={<LoginPage />} />
                      <Route path="/signup" element={<RegisterPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;

// -------------------- Pages --------------------

function LoginPage() {
  return <SignIn routing="path" path="/signin" />;
}

function RegisterPage() {
  return <SignUp routing="path" path="/signup" />;
}
