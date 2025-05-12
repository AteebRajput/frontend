import { useEffect, useState } from "react";
import "./signup.css";
import { useSelector, useDispatch } from "react-redux";
import { signupUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../../../public/img3.jpg";

function Signup() {
  const dispatch = useDispatch();
  const {  user } = useSelector((state) => state.user);
  const navigate = useNavigate()
  useEffect(() =>{
    if(user){
      navigate('/verify-email')
    }
  },[user,navigate])

  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    company: "",
    companyVAT: "",
    phone: "",
    address: "",
    postalCode: "",
    nic:"",
    state: "",
    companyActivity: "",
    language: "EN",
    preferredProducts: [],
    otherProducts: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAgreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "preferredProducts") {
      setFormData((prevData) => ({
        ...prevData,
        preferredProducts: checked
          ? [...prevData.preferredProducts, value]
          : prevData.preferredProducts.filter((product) => product !== value),
      }));
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }
  
    // Pakistani phone number validation regex
    const phonePattern = /^(?:\+92|0)(3\d{9})$/;
    if (!phonePattern.test(formData.phone)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567 or 03001234567)!");
      return;
    }
  
    // NIC (CNIC) validation - 13 digits without dashes
    const nicPattern = /^\d{13}$/;
    if (!nicPattern.test(formData.nic)) {
      toast.error("Please enter a valid 13-digit NIC (without dashes)!");
      return;
    }
  
    // Postal code validation - must be numeric
    if (!/^\d+$/.test(formData.postalCode)) {
      toast.error("Postal Code must be numeric!");
      return;
    }
  
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    // Terms & Conditions agreement validation
    if (!formData.termsAgreed) {
      toast.error("You must accept the terms and conditions!");
      return;
    }
  
    // Combine firstName and lastName into a single 'name' field
    const updatedFormData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
    };
  
    // Remove firstName, lastName, and confirmPassword from final data
    delete updatedFormData.firstName;
    delete updatedFormData.lastName;
    delete updatedFormData.confirmPassword;
  
    dispatch(signupUser(updatedFormData));
    toast.success("Signup successful!");
  
    // Reset form after successful submission
    setFormData({
      role: "",
      firstName: "",
      lastName: "",
      company: "",
      companyVAT: "",
      phone: "",
      address: "",
      postalCode: "",
      state: "",
      companyActivity: "",
      language: "EN",
      preferredProducts: [],
      otherProducts: "",
      email: "",
      nic: "",
      password: "",
      confirmPassword: "",
      termsAgreed: false,
    });
  };

  

  return (
        <div
          className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
          style={{
            backgroundImage: `url(${img})`, 
          }}
        >
      <ToastContainer />
      <div className="signup-container">
        <h1>SIGN-UP</h1>
        <p className="subtitle">
          If you are already registered <a href="#" onClick={() =>{navigate("/login")}}>Login here</a>. Otherwise,
          tell us more about you! Your sign-up information will help us provide
          a great experience.
          <br />
          For sellers, additional information will be needed to receive funds.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            {/* Left Column */}
            <div className="form-column">
              <h3>
                I am <hr />
              </h3>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === "buyer"}
                    onChange={handleChange}
                  />{" "}
                  Buyer
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={handleChange}
                  />{" "}
                  Seller
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="both"
                    checked={formData.role === "both"}
                    onChange={handleChange}
                  />{" "}
                  Both
                </label>
              </div>
              <div className="try">
                <div>
                  <label className="lab">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="lab">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              <label className="lab">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company"
              />
              <div className="try">
                <div>
                  <label className="lab">Company VAT</label>
                  <input
                    type="text"
                    name="companyVAT"
                    value={formData.companyVAT}
                    onChange={handleChange}
                    placeholder="Company VAT*"
                  />
                </div>
                <div>
                  <label className="lab">Number*</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Mobile Number*"
                  />
                </div>
              </div>
              <label className="lab">Location*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Location*"
              />

              <label className="lab">Postal Code*</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Zip Code*"
              />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                <option value="Sindh">Sindh</option>
                <option value="Punjab">Punjab</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                <option value="Azad Jammu and Kashmir">
                  Azad Jammu and Kashmir
                </option>
                <option value="Islamabad Capital Territory">
                  Islamabad Capital Territory
                </option>
              </select>
              <select
                name="companyActivity"
                value={formData.companyActivity}
                onChange={handleChange}
              >
                <option value="">Company Activity*</option>
                <option value="farming">Farming</option>
                <option value="trading">Trading</option>
              </select>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="EN">English (EN)</option>
                <option value="ES">Urdu (UR)</option>
              </select>
            </div>
            {/* Right Column */}
            <div className="form-column">
              <label>Preferred Product(s)</label>
              <div className="checkbox-group">
                {[
                  "Corn",
                  "Almond",
                  "Hazelnut",
                  "Rice",
                  "Cashew",
                  "Walnut",
                  "Coffee",
                ].map((product) => (
                  <label key={product}>
                    <input
                      type="checkbox"
                      name="preferredProducts"
                      value={product}
                      checked={formData.preferredProducts.includes(product)}
                      onChange={handleChange}
                    />{" "}
                    {product}
                  </label>
                ))}
              </div>
              <input
                type="text"
                name="otherProducts"
                value={formData.otherProducts}
                onChange={handleChange}
                placeholder="Other Preferred Product(s)"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="Nic"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (minimum 6 characters)"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <label className="terms">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                />
                <p>
                  I agree with the{" "}
                  <a href="#">AgriTech Marketplace Terms and Privacy Policy</a>
                </p>
              </label>
              <button type="submit" className="signup-btn">
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
