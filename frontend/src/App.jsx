import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Schedule from "./pages/Schedule";
import Compliance from "./pages/Compliance";
import QRGenerator from "./pages/QRGenerator";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";

function App() {
  return (
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
                  </Routes>
                </main>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;

