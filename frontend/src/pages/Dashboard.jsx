import StatsCard from '../components/dashboard/StatsCard';
import WasteChart from '../components/dashboard/WasteChart';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total E-Waste Items" 
          value="1,248" 
          change="+12%" 
          icon="box" 
          trend="up" 
        />
        <StatsCard 
          title="Recycled This Month" 
          value="327" 
          change="+8%" 
          icon="recycle" 
          trend="up" 
        />
        <StatsCard 
          title="Pending Pickups" 
          value="42" 
          change="-3%" 
          icon="calendar" 
          trend="down" 
        />
        <StatsCard 
          title="Active Campaigns" 
          value="5" 
          change="+25%" 
          icon="users" 
          trend="up" 
        />
      </div>
      
      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WasteChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
      
      {/* Other dashboard content... */}
    </div>
  );
};

export default Dashboard;
