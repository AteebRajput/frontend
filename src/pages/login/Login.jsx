import { useState, useEffect } from "react";
import "./login.css";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../Component/Input";
import { loginUser } from "../../../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import img from "../../../public/img3.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role selection state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.user);

  // Redirect to appropriate dashboard based on role
  useEffect(() => {
    if (user) {
      if (user.role === "buyer") {
        navigate("/buyer-dashboard");
      } else if (user.role === "seller" || user.role === "both") {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      alert("Please fill in all fields, including role selection");
      return;
    }

    try {
      // Dispatch the login action
      dispatch(loginUser({ email, password }));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`, 
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Role Selection Dropdown */}
            <div className="mb-4">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-green-700 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 "
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="flex items-center mb-6">
              <Link to="/forgot-password" className="text-sm text-green-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error} {/* Display error message */}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={loading || !email || !password || !role} // Disable button if fields are empty
            >
              {loading ? "Logging in..." : "Log In"}
            </motion.button>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
