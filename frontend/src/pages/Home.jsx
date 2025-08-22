import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const HeroSection = () => (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white/70 p-8 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/50 md:p-10">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full !bg-emerald-300/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-28 h-96 w-96 rounded-full !bg-teal-300/20 blur-3xl" />

      <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 !bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <span>♻️</span>
            <span>Smart E-waste lifecycle</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            <span className="!bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Sustainable E‑Waste Management</span>
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-gray-600 md:text-lg">
            Track inventory, schedule certified pickups, generate QR codes, and stay compliant — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/schedule')}
              className="inline-flex items-center justify-center rounded-lg !bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:!bg-emerald-700 hover:shadow-md active:translate-y-0">
              Schedule Pickup
            </button>
            <button
              onClick={() => navigate('/qr-generator')}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:!bg-emerald-50 hover:shadow-md active:translate-y-0">
              Generate QR
            </button>
            <button
              onClick={() => navigate('/inventory')}
              className="inline-flex items-center justify-center rounded-lg border border-teal-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:!bg-teal-50 hover:shadow-md active:translate-y-0">
              View Inventory
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Devices Recycled</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">12,483</p>
          </div>
          <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">CO₂ Saved</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">28.7t</p>
          </div>
          <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Active Pickups</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">36</p>
          </div>
        </div>
      </div>
    </section>
  );

  const FeaturesSection = () => (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Everything you need to manage e-waste efficiently and sustainably
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/70 rounded-xl p-6 border border-emerald-200/60 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Tracking</h3>
          <p className="text-gray-600">
            Generate unique QR codes for each e-waste item and track their complete lifecycle from collection to disposal.
          </p>
        </div>
        
        <div className="bg-white/70 rounded-xl p-6 border border-emerald-200/60 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
          <p className="text-gray-600">
            Schedule certified pickups with real-time tracking and automated notifications for efficient collection.
          </p>
        </div>
        
        <div className="bg-white/70 rounded-xl p-6 border border-emerald-200/60 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Compliance</h3>
          <p className="text-gray-600">
            Monitor environmental impact, track compliance metrics, and generate detailed reports for stakeholders.
          </p>
        </div>
      </div>
    </section>
  );

  const StatsSection = () => (
    <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200/60">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Environmental Impact</h2>
        <p className="text-lg text-gray-600">
          See the real difference your e-waste management makes
        </p>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">♻️</div>
          <div className="text-2xl font-bold text-gray-900">12,483</div>
          <div className="text-sm text-gray-600">Devices Recycled</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">🌱</div>
          <div className="text-2xl font-bold text-gray-900">28.7t</div>
          <div className="text-sm text-gray-600">CO₂ Saved</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">💧</div>
          <div className="text-2xl font-bold text-gray-900">156L</div>
          <div className="text-sm text-gray-600">Water Saved</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">⚡</div>
          <div className="text-2xl font-bold text-gray-900">89.2kWh</div>
          <div className="text-sm text-gray-600">Energy Saved</div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
    </div>
  );
};

export default Home;