import "./Navbar.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../../slices/userSlice";
import LanguageSwitcher from "../../../lib/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [userName, setuserName] = useState(null);
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      setuserName(userObject.user.name);
    } else {
      console.log(t("noUserData"));
    }
  }, [isLoggedIn, t]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error(`${t("logoutFailed")}`, error);
    }
  };

  const renderLinks = () => {
    if (isLoggedIn) {
      return (
        <>
          <li className="language-item">
            <LanguageSwitcher />
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              {t("logout")}
            </button>
          </li>
        </>
      );
    }

    if (location.pathname === "/signup" || !isLoggedIn) {
      return (
        <li>
          <button className="auth-button" onClick={() => navigate("/login")}>
            {t("login")}
          </button>
        </li>
      );
    } else if (location.pathname === "/login") {
      return (
        <li>
          <button className="auth-button" onClick={() => navigate("/signup")}>
            {t("signup")}
          </button>
        </li>
      );
    } else {
      return (
        <>
          <li>
            <button className="auth-button" onClick={() => navigate("/login")}>
              {t("login")}
            </button>
          </li>
          <li>
            <button className="auth-button" onClick={() => navigate("/signup")}>
              {t("signup")}
            </button>
          </li>
        </>
      );
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-green-500 to-emerald-600">
      <nav>
        <div className="logo text-white">
          <img src="../../../../public/logo2.png" alt="" height={"60px"} />
        </div>

        <div className={`links ${isOpen ? "open" : ""}`}>
          <ul>{renderLinks()}</ul>
        </div>

        <div className="menu-icon text-white items-center" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
