import { ShoppingCart, FileText, User, Coins, ChartPie, Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import profileImage from "../../assets/832.jpg";
import { useTranslation } from "react-i18next";

const BuyerSidebar = () => {
  const { t } = useTranslation();
  const menuItems = [
    {
      icon: User,
      label: `${t("accountInfo")}`,
      path: "/buyer-dashboard/account",
    },
    {
      icon: ShoppingCart,
      label: `${t("myOrder")}`,
      path: "/buyer-dashboard/orders",
    },
    {
      icon: FileText,
      label: `${t("browseProducts")}`,
      path: "/buyer-dashboard/products",
    },
    {
      icon: Coins,
      label: `${t("myBids")}`,
      path: "/buyer-dashboard/bids",
    },
    {
      icon: ChartPie,
      label: `${t("sellerAnalytics")}`,
      path: "/buyer-dashboard/sellers",
    },
    {
      icon: Truck,
      label: `${t("logistics")}`,
      path: "/buyer-dashboard/logistics",
    },
  ];

  const location = useLocation();
  const activePath = location.pathname;
  const data = JSON.parse(localStorage.getItem("user"));

  return (
    <aside className="fixed top-20 left-0 h-full w-64 bg-white border-r border-gray-200">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-25 h-25 rounded-full bg-gray-200 overflow-hidden mb-4">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {data?.user.name}
          </h2>
          <p className="text-sm text-gray-500">{data?.user.company}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-md ${
                  activePath === item.path
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default BuyerSidebar;
