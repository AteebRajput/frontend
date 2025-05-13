"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Clock,
  Package,
  Trash2,
  Edit,
  Eye,
  BadgeDollarSign,
  MapPin,
  Calendar,
  Tag,
  ClipboardList,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/product-ui/Dialog";
import { Button } from "../ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs";
import { useTranslation } from "react-i18next";
import { Scale, Timer, AlertCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Switch } from "../ui/product-ui/Switch";
import axios from "axios";
// import toast from "react-hot-toast";
// import { json } from "express";
import { toast } from "react-toastify";
import { useState as useReactState } from "react";
// const PRODUCT_API_URL = "http://localhost:5000/api/product"
const PRODUCT_API_URL = "https://backend-production-c261.up.railway.app/api/product";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("all");
  const [showAuctionExtend, setShowAuctionExtend] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [extendDuration, setExtendDuration] = useState({
    value: 1,
    unit: "hours",
  });

  // Get userId from localStorage
  const data = JSON.parse(localStorage.getItem("userId") || "{}");
  const userId = data.userId;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${PRODUCT_API_URL}/get-all-products/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const handleUpdateProduct = async (productData) => {
    try {
      // Remove bidDuration if not applicable
      const { bidDuration, ...dataToSend } = productData;
      // console.log("Data to send", dataToSend)

      const response = await axios.put(
        `${PRODUCT_API_URL}/update-product/${dataToSend._id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        await fetchProducts();
        toast.success("Product Updated successfully");
        setShowUpdateDialog(false);
        setShowAuctionExtend(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update product";
      setError(errorMessage);
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${PRODUCT_API_URL}/delete-product/${productId}`);
        await fetchProducts(); // Refresh products after deletion
        toast.success("Product deleted successfully!");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleAddProduct = async (productData, imageFiles) => {
    try {
      const formData = new FormData();

      // Append all text fields first
      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      // Append image files with correct field name
      imageFiles.forEach((file, index) => {
        formData.append(`images`, file); // Matches backend expectation
      });

      const response = await axios.post(
        `${PRODUCT_API_URL}/add-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchProducts(); // Refresh products after addition
      toast.success("Product Added Successfaully!");
      // Rest of your code remains the same
    } catch (error) {
      console.error("Add Product Error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to add product");
    }
  };

  const filteredProducts = products?.filter((product) => {
    if (selectedTab === "auction") return product.upForAuction;
    if (selectedTab === "normal") return !product.upForAuction;
    return true;
  });

  const ProductForm = ({ product, onSubmit, onClose, isNew = false }) => {
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState(product.images || []);
    const [selectedCrop, setSelectedCrop] = useReactState("");
    const [selectedArea, setSelectedArea] = useReactState("");
    const [predictedPrice, setPredictedPrice] = useReactState(null);
    const [category, setCategory] = useState("");
    const [isPredicting, setIsPredicting] = useReactState(false);
    const [selectedProvince, setSelectedProvince] = useState("");

    const handleArea = (province) => {
      setSelectedProvince(province);
    
      switch (province) {
        case "Punjab":
          setSelectedArea("Gujranwala");
          break;
        case "Sindh":
          setSelectedArea("Yazman");
          break;
        case "KPK":
          setSelectedArea("AhmadPurEast");
          break;
        case "Islamabad":
          setSelectedArea("Lahore");
          break;
        default:
          setSelectedArea("");
      }
    };
    
    const provincesList = [
      { value: "Punjab", label: "Punjab" },
      { value: "Sindh", label: "Sindh" },
      { value: "KPK", label: "KPK" },
      { value: "Islamabad", label: "Islamabad" },
    ];

    // Crop and area data
    const cropData = {
      Orange: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Mango(Sindhri)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Capsicum: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Banana(DOZENS)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Pomegranate Desi": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Apple Kala Kullu (Pahari)": [
        "AhmadPurEast",
        "Yazman",
        "Lahore",
        "Gujranwala",
      ],
      "Apple (Ammre)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Apple (Gatcha)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Apple (Golden)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Apple Kala Kullu (Madani)": [
        "AhmadPurEast",
        "Yazman",
        "Lahore",
        "Gujranwala",
      ],
      "Apricot Yellow": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Apricot White": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Cabbage: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Carrot: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Carrot China": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Cauliflower: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Coriander (دھنیا)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Capsicum (شملہ مرچ)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Cocoyam(اروی)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Cucumber (Kheera)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "feutral early(100 Pcs) فروٹر": [
        "AhmadPurEast",
        "Yazman",
        "Lahore",
        "Gujranwala",
      ],
      "Garlic (Local)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Gram Black": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Garlic (China)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Ginger (Thai)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Gram Pulse": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Gram White(Imported)": [
        "AhmadPurEast",
        "Yazman",
        "Lahore",
        "Gujranwala",
      ],
      "Grapefruit(100Pcs)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Gram White(local)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Jaggery (گڑ)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Guava: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Lemon (Desi)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Lemon (China)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Kinnow (100Pcs)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Moong Pulse": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Mango(Anwer Ratol)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Mango(Desahri)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Masoor Pulse(local)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Melon: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Mash Pulse(Imported) washed": [
        "AhmadPurEast",
        "Yazman",
        "Lahore",
        "Gujranwala",
      ],
      "Mash Pulse(local)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Orange(100Pcs)": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      Peach: ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Peach Special": ["AhmadPurEast", "Yazman", "Lahore", "Gujranwala"],
      "Pomegranate(Kandhari)": [
        "AhmadPurEast",
        "Yazman",
        "Lahore",
        "Gujranwala",
      ],
    };

    const predictPrice = async () => {
      if (!selectedCrop || !selectedArea) {
        toast.error("Please select both crop and area");
        return;
      }

      try {
        setIsPredicting(true);

        // Capitalize first letter of crop and area
        const formattedCrop =
          selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
        const formattedArea =
          selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1);

        const response = await axios.post("http://127.0.0.1:5000/predict", {
          crop: formattedCrop,
          area: formattedArea,
        });
        // console.log("Predicted Price Response:", response);

        setPredictedPrice(response.data.prediction);
        // console.log("Price prediction:", response.data.prediction);

        toast.success("Price prediction successful!");

        // Auto-fill the basePrice field if it's empty or if user confirms
        if (
          !product.basePrice ||
          window.confirm(
            "Would you like to use the predicted price as the base price?"
          )
        ) {
          const basePriceInput = document.getElementById("basePrice");
          if (basePriceInput) {
            basePriceInput.value = response.data.predicted_price;
          }
        }
      } catch (error) {
        console.error("Price prediction error:", error);
        toast.error("Failed to predict price. Please try again.");
      } finally {
        setIsPredicting(false);
      }
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...previews]);
    };

    const removeImage = (index) => {
      const newFiles = [...imageFiles];
      newFiles.splice(index, 1);
      setImageFiles(newFiles);

      const newPreviews = [...imagePreview];
      newPreviews.splice(index, 1);
      setImagePreview(newPreviews);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const processedData = {
        _id: product._id,
        ...data,
        seller: userId, // Add this line to include seller
        basePrice: Number(data.basePrice) || 0,
        quantity: Number(data.quantity) || 0,
        upForAuction: data.upForAuction === "true",
        harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        category: category,
        bidEndTime:
          data.upForAuction === "true" && data.bidEndTime
            ? new Date(data.bidEndTime)
            : null,
        status: data.status || "draft",
      };

      onSubmit(processedData, imageFiles);
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent">
              {isNew ? `${t("addNewProduct")}` : `${t("updateProduct")}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            {/* Basic Information Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <ClipboardList className="w-5 h-5 text-primary" />{" "}
                {t("basicInfo")}
              </h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-700">
                    {t("productName")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={product.name}
                    required
                    className="transition-shadow focus:shadow-md"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-gray-700">
                    {t("discription")}
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={product.description}
                    required
                    className="min-h-[100px] transition-shadow focus:shadow-md"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-gray-700">
                    {t("category")}
                  </Label>
                  <Select
                    defaultValue={product.category}
                    onValueChange={(value) => {
                      // handle category change (e.g., update form state)
                      console.log("Selected category:", value);
                      setCategory(value)
                    }}
                    required
                  >
                    <SelectTrigger
                      id="category"
                      className="transition-shadow focus:shadow-md"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] bg-white">
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Grains">Grains</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Price and Quantity Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <BadgeDollarSign className="w-5 h-5 text-primary" />{" "}
                {t("pricing")}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="basePrice" className="text-gray-700">
                      {t("baseprice")}
                    </Label>
                    <Input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={product.basePrice}
                      required
                      className="transition-shadow focus:shadow-md"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quantity" className="text-gray-700">
                      {t("quantity")}
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      defaultValue={product.quantity}
                      required
                      className="transition-shadow focus:shadow-md"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit" className="text-gray-700">
                      {t("unit")}
                    </Label>
                    <Select name="unit" defaultValue={product.unit || "kg"}>
                      <SelectTrigger className="transition-shadow focus:shadow-md">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="kg">{t("kilogram")}</SelectItem>
                        <SelectItem value="liter">{t("liter")}</SelectItem>
                        <SelectItem value="piece">{t("piece")}</SelectItem>
                        <SelectItem value="box">{t("box")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quality" className="text-gray-700">
                      {t("qualityGrade")}
                    </Label>
                    <Input
                      id="quality"
                      name="quality"
                      defaultValue={product.quality}
                      required
                      className="transition-shadow focus:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Price Prediction Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <BadgeDollarSign className="w-5 h-5 text-primary" /> AI Price
                Prediction
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cropSelect" className="text-gray-700">
                        Select Crop
                      </Label>
                      <Select
                        value={selectedCrop}
                        onValueChange={setSelectedCrop}
                      >
                        <SelectTrigger className="w-full bg-white transition-shadow focus:shadow-md">
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-white">
                          {Object.keys(cropData).map((crop) => (
                            <SelectItem key={crop} value={crop}>
                              {crop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="areaSelect" className="text-gray-700">
                        Select Area
                      </Label>
                      <Select
  value={selectedProvince}
  onValueChange={handleArea}
  disabled={!selectedCrop}
>
  <SelectTrigger className="transition-shadow focus:shadow-md">
    <SelectValue
      placeholder={selectedCrop ? "Select area" : "Select crop first"}
    />
  </SelectTrigger>
  <SelectContent className="max-h-[200px] bg-white">
    {selectedCrop &&
      provincesList?.map((area) => (
        <SelectItem key={area.value} value={area.value}>
          {area.label}
        </SelectItem>
      ))}
  </SelectContent>
</Select>

                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <Button
                    type="button"
                    onClick={predictPrice}
                    disabled={!selectedCrop || !selectedArea || isPredicting}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isPredicting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Predicting...
                      </>
                    ) : (
                      <>Predict Price</>
                    )}
                  </Button>

                  {predictedPrice !== null && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-center">
                        <span className="text-gray-700">Predicted Price: </span>
                        <span className="text-xl font-bold text-green-700">
                          ₨ {predictedPrice}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location and Dates Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <MapPin className="w-5 h-5 text-primary" /> {t("locationDate")}
              </h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="location" className="text-gray-700">
                    {t("location")}
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={product.location}
                    required
                    className="transition-shadow focus:shadow-md"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="harvestDate" className="text-gray-700">
                      {t("harvestDate")}
                    </Label>
                    <Input
                      id="harvestDate"
                      name="harvestDate"
                      type="date"
                      defaultValue={product.harvestDate?.split("T")[0]}
                      required
                      className="transition-shadow focus:shadow-md"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate" className="text-gray-700">
                      {t("expiryDate")}
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      defaultValue={product.expiryDate?.split("T")[0]}
                      required
                      className="transition-shadow focus:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Auction Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <Tag className="w-5 h-5 text-primary" /> {t("statusAuction")}
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status" className="text-gray-700">
                      {t("statuss")}
                    </Label>
                    <Select
                      name="status"
                      defaultValue={product.status || "draft"}
                    >
                      <SelectTrigger className="transition-shadow focus:shadow-md">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="draft">{t("draft")}</SelectItem>
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="sold">{t("sold")}</SelectItem>
                        <SelectItem value="expired">{t("expired")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="upForAuction" className="text-gray-700">
                      {t("upForAuction")}
                    </Label>
                    <Switch
                      id="upForAuction"
                      name="upForAuction"
                      defaultChecked={product.upForAuction}
                      value="true"
                      className="data-[state=checked]:bg-green-500 bg-gray-300"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bidEndTime" className="text-gray-700">
                    {t("auctionEnd")}
                  </Label>
                  <Input
                    id="bidEndTime"
                    name="bidEndTime"
                    type="datetime-local"
                    defaultValue={product.bidEndTime?.split(".")[0]}
                    className="transition-shadow focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">{t("images")}</h3>
              <div className="grid gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-4"
                />
                <div className="grid grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="hover:bg-gray-100 bg-green-400 transition-colors duration-200"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:to-sky-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isNew ? `${t("addProduct")}` : `${t("updateProduct")}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const ProductDetail = ({ product, onClose }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
      if (product.upForAuction && product.bidEndTime) {
        const timer = setInterval(() => {
          const now = new Date();
          const end = new Date(product.bidEndTime);
          const diff = end - now;

          if (diff <= 0) {
            setTimeLeft("Auction Ended");
            clearInterval(timer);
          } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          }
        }, 1000);

        return () => clearInterval(timer);
      }
    }, [product.bidEndTime]);

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent">
              {product.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-8 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Gallery Section */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={
                      product.images?.[activeImage] ||
                      "/api/placeholder/400/300" ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-4 right-4 shadow-xl ${
                      product.status === `${t("actives")}`
                        ? "bg-green-500/90 hover:bg-green-500"
                        : product.status === `${t("solds")}`
                        ? "bg-blue-500/90 hover:bg-blue-500"
                        : product.status === `${t("expireds")}`
                        ? "bg-red-500/90 hover:bg-red-500"
                        : "bg-yellow-500/90 hover:bg-yellow-500"
                    } backdrop-blur-sm transition-colors duration-300`}
                  >
                    {product.status.toUpperCase()}
                  </Badge>
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`relative rounded-lg overflow-hidden ${
                          activeImage === index
                            ? "ring-2 ring-primary ring-offset-2"
                            : "hover:opacity-80"
                        } transition-all duration-200`}
                      >
                        <img
                          src={image || "/api/placeholder/100/100"}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                {product.upForAuction && (
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Timer className="w-6 h-6 text-amber-600" />
                      <h3 className="font-bold text-lg text-amber-800">
                        {t("auctionStatus")}
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-amber-900 mb-2">
                      {timeLeft ? timeLeft : "Loading..."}
                    </p>
                    <p className="text-sm text-amber-700">
                      {t("ends")}: {formatDate(product.bidEndTime)}{" "}
                      {new Date(product.bidEndTime).toLocaleTimeString()}
                    </p>
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <Scale className="w-5 h-5 text-primary" />
                        <span className="font-medium">{t("baseprice")}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        ₨ {product.basePrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-medium">{t("quantity")}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-700">
                        {product.quantity} {product.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-medium">{t("location")}</span>
                      </div>
                      <span className="text-gray-700">{product.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold mb-4 text-gray-800">
                  {t("productInfo")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{t("category")}</p>
                    <p className="font-medium text-gray-800">
                      {product.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("qualityGrade")}</p>
                    <p className="font-medium text-gray-800">
                      {product.quality}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold mb-4 text-gray-800">
                  {t("impDates")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("harvestDate")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {formatDate(product.harvestDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("expiryDate")}</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(product.expiryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-green-500 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-4xl py-2 font-bold bg-gradient-to-r from-green-400 via-green-600 to-blue-900 bg-clip-text text-transparent">
              {t("empowering")}
            </h1>

            <p className="text-gray-600 text-xl mt-1">{t("manage")}</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-green-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 mr-2" /> {t("addNewProduct")}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700 animate-fadeIn">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-2" /> {t("allProducts")}
            </TabsTrigger>
            <TabsTrigger
              value="normal"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-2" /> {t("regular")}
            </TabsTrigger>
            <TabsTrigger
              value="auction"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
            >
              <Clock className="w-4 h-4 mr-2" /> {t("auction")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={product.images?.[0] || "/api/placeholder/400/300"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge
                        className={`absolute top-4 right-4 ${
                          product.status === `${t("actives")}`
                            ? "bg-green-500"
                            : product.status === `${t("solds")}`
                            ? "bg-blue-500"
                            : product.status === `${t("expireds")}`
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        } shadow-lg`}
                      >
                        {product.status.toUpperCase()}
                      </Badge>
                      {product.upForAuction && (
                        <Badge className="absolute top-4 left-4 bg-amber-500 shadow-lg">
                          <Clock className="w-4 h-4 mr-1" /> {t("auction")}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-md line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-primary" />
                        <span className="font-semibold">
                          ₨{product.basePrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span
                          className={
                            product.quantity === 0
                              ? "text-red-500"
                              : "text-black"
                          }
                        >
                          {product.quantity === 0
                            ? `${t("Out Of Stock")}`
                            : `${product.quantity} ${product.unit}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 pt-3 p-4 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDetailDialog(true);
                      }}
                      className="hover:bg-primary hover:text-green hover:bg-green-500 hover:text-white transition-colors duration-300"
                    >
                      <Eye className="w-4 h-4 mr-2" /> {t("view")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowUpdateDialog(true);
                      }}
                      className=" hover:bg-sky-600 hover:text-white transition-colors duration-300"
                    >
                      <Edit className="w-4 h-4 mr-2" /> {t("edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="hover:bg-red-600 hover:text-white transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> {t("delete")}
                    </Button>

                    {/* <Button
                      className="w-full"
                      onClick={() => setIsChatOpen(true)}
                    >
                      {t("chatWithSeller")}
                    </Button> */}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Keep existing dialog components */}
      {showDetailDialog && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => {
            setShowDetailDialog(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {(showUpdateDialog || showAddDialog) && (
        <ProductForm
          product={
            showAddDialog
              ? {
                  name: "",
                  description: "",
                  category: "",
                  basePrice: "",
                  quantity: "",
                  unit: "kg",
                  quality: "",
                  location: "",
                  harvestDate: "",
                  expiryDate: "",
                  status: "draft",
                  upForAuction: false,
                  bidEndTime: "",
                  images: [],
                }
              : selectedProduct
          }
          onSubmit={showAddDialog ? handleAddProduct : handleUpdateProduct}
          onClose={() => {
            showAddDialog
              ? setShowAddDialog(false)
              : setShowUpdateDialog(false);
            setSelectedProduct(null);
          }}
          isNew={showAddDialog}
        />
      )}
    </div>
  );
}
