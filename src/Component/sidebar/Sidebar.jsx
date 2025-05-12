import { Store, ShoppingCart, Gavel, Truck,CloudSun, User,MessageCircleMore } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import profileImage from "../../assets/832.jpg"
import { useTranslation } from "react-i18next";

const FarmerSidebar = () => {

  const {t} = useTranslation()
  const menuItems = [
    { icon: User, label: `${t("accountInfo")}`, path: "/dashboard/account" },
    { icon: ShoppingCart, label: `${t("myOrder")}`, path: "/dashboard/orders" },
    { icon: Store, label: `${t("productList")}`, path: "/dashboard/products" },
    { icon: Gavel, label: `${t("allBids")}`, path: "/dashboard/auctions" },
    { icon: MessageCircleMore, label: `${t("messages")}`, path: "/dashboard/seller-messages" },
    { icon: CloudSun, label: `${t("weather")}`, path: "/dashboard/weather" }, // New weather route
    { icon: Truck, label: `${t("logistics")}`, path: "/dashboard/logistics" } // New weather route
  ];
  const data = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();
  const activePath = location.pathname;

  return (
    <aside className="fixed top-20 left-0 h-full w-64 bg-white border-r border-gray-200">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-25 h-25 rounded-full bg-gray-200 overflow-hidden mb-4">
            <img
              src={profileImage}
              alt="Profile"
              width={"w-24"}
              height={"h-24"}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{data?.user.name}</h2>
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

export default FarmerSidebar;
