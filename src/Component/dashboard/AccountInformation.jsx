import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../../Component/ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useTransform } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  Globe,
  TagIcon,
  Activity,
  BookOpen,
} from "lucide-react";
import { updateUser, fetchUserData } from "../../../slices/userSlice";
import { useTranslation } from "react-i18next";

const AccountInformation = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    companyActivity: "",
    companyVAT: "",
    isVerified: false,
    language: "EN",
    nic: "",
    otherProducts: "",
    postalCode: "",
    preferredProducts: [],
    role: "",
    state: "",
  });

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        company: user.company || "",
        companyActivity: user.companyActivity || "",
        companyVAT: user.companyVAT || "",
        isVerified: user.isVerified || false,
        language: user.language || "EN",
        nic: user.nic || "",
        otherProducts: user.otherProducts || "",
        postalCode: user.postalCode || "",
        preferredProducts: user.preferredProducts || [],
        role: user.role || "",
        state: user.state || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateUser(formData)).unwrap();
      if (status !== "failed") {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error]);

  if (status === "loading") {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loadingUserInfo")}</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>{t("failedToLoadInfo")}</p>
          <Button
            onClick={() => dispatch(fetchUserData())}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("retry")}
          </Button>
        </div>
      </div>
    );
  }

  const languageOptions = ["English", "Urdu"];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-green-100 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center justify-between py-2">
            <span className="text-2xl font-bold text-gray-800">{t("accountInfo")}</span>
            <div className="space-x-3">
              {isEditing && (
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="hover:bg-gray-100 transition-colors"
                >
                  {t("cancel")}
                </Button>
              )}
              <Button
                onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
                variant={isEditing ? "default" : "default"}
                disabled={status === "loading"}
                className="bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                {status === "loading" ? "Saving..." : isEditing ? `${t("saveChanges")}` : `${t("editProfile")}`}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Personal Information */}
            <section className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 text-blue-500 mr-2" />
                {t("personalInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("fullName")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("email")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("phone")}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("nic")}</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="nic"
                      value={formData.nic}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Location Information */}
            <section className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <MapPin className="w-6 h-6 text-green-500 mr-2" />
                {t("locationinfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("address")}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("postalCode")}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("preferredLang")}</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Information */}
            <section className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Building className="w-6 h-6 text-orange-500 mr-2" />
                {t("companyInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("company")}</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("activity")}</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="companyActivity"
                      value={formData.companyActivity}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("companyVAT")}</label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="companyVAT"
                      value={formData.companyVAT}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountInformation;
