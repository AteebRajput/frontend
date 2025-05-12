
import { Outlet } from "react-router-dom";
import BuyerSidebar from "../../Component/sidebar/BuyerSidebar";



const BuyerDashboard = () => {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <BuyerSidebar />

      {/* Main Content Area */}
      <div className="ml-64 w-full p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default BuyerDashboard; 