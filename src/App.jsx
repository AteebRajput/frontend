import "./App.css";
import MainPage from "./Component/Firstpage/MainPage";
import Signup from "./pages/signup/signup";
import "./i18n.js"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import Navbar from "./Component/Firstpage/Navbar/Navbar";
import LoginPage from "./pages/login/Login";
import ForgotPasswordPage from "./pages/forgetPassword/ForgetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import AccountInformation from "./Component/dashboard/AccountInformation";
import ResetPasswordPage from "./pages/resetPassword/ResetPassword.jsx";
import AllAuctions from "./Component/dashboard/AllAuctions";
import MyOrders from "./Component/dashboard/MyOrder";
import ProductsPage from "./Component/dashboard/ProductList";
import ProductList from "./Component/BuyerDashboard/ProductList";
import BuyerDashboard from "./pages/dashboard/BuyerDashboars";
import BuyerOrder from "./Component/BuyerDashboard/BuyerOrder";
import MessagesSeller from "./Component/dashboard/MessagesSeller.jsx";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import BuyerBids from "./Component/BuyerDashboard/BuyerBids";
import WeatherDashboard from "./Component/dashboard/Weather.jsx";
import Sellers from "./Component/BuyerDashboard/SellerAnalytics.jsx";
import DetailedSellerAnalytics from "./Component/BuyerDashboard/DetailedSellerAnalytics.jsx";
import LogisticsPage from "./Component/BuyerDashboard/Logistics.jsx";

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return isLoggedIn ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Router>
        <Navbar />
        {/* Add ToastContainer at the root level */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:id" element={<ResetPasswordPage/>} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={<ProtectedRoute element={<Dashboard />} />}
          >
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<AccountInformation />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="auctions" element={<AllAuctions />} />
            <Route path="seller-messages" element={<MessagesSeller />} />
            <Route path="weather" element={<WeatherDashboard />} />
            <Route path="logistics" element={<LogisticsPage />} />

          </Route>

          {/* Buyer Dashboard Route */}
          <Route
            path="/buyer-dashboard/*"
            element={<ProtectedRoute element={<BuyerDashboard />} />}
          >
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<AccountInformation />} />
            <Route path="products" element={<ProductList />} />
            <Route path="orders" element={<BuyerOrder />} />
            <Route path="bids" element={<BuyerBids />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="sellers/:id" element={<DetailedSellerAnalytics />} />
            <Route path="logistics" element={<LogisticsPage />} />
            

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
