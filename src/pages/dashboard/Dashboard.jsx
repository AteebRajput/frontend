
import { Outlet } from "react-router-dom";
import FarmerSidebar from "../../Component/sidebar/Sidebar";



const Dashboard = () => {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <FarmerSidebar />

      {/* Main Content Area */}
      <div className="ml-64 w-full p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard; 