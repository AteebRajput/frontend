import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTheProducts } from "../../../slices/productSlice";
import { placeBid } from "../../../slices/auctionSlice";
import { createOrder } from "../../../slices/orderSlice";
import ProductCard from "../ui/ProductCard";
import ProductDetail from "../ui/ProductDetail";
import { Input } from "../ui/Input";
import {useTranslation} from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/product-ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Button } from "../ui/Button";
import { Switch } from "../ui/product-ui/Switch";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { auctions } = useSelector((state) => state.auctions);
  const { t } = useTranslation(); // Initialize translation function

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [viewAuctions, setViewAuctions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [orderAmount, setOrderAmount] = useState(""); // For placing order

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    dispatch(fetchAllTheProducts(userId));
  }, [dispatch]);

  const handleProductDetails = (product) => {
    const productAuction = auctions.find(
      (auction) => auction.productId === product._id
    );
    setSelectedProduct({ ...product, auction: productAuction });
  };

  const handleBid = async (product) => {
    if (!product || !product.auction) return;

    const bidData = {
      auctionId: product.auction._id,
      bidderId: localStorage.getItem("userId"),
      bidAmount: parseFloat(bidAmount),
    };

    try {
      await dispatch(placeBid(bidData)).unwrap();
      setBidAmount("");
    } catch (error) {
      console.error("Bid placement error:", error);
    }
  };

  const handlePlaceOrder = async (product) => {
    if (!product) return;
  
    const orderData = {
      productId: product._id,
      winnerId: localStorage.getItem("userId"), // Assuming buyer is the user
      amount: parseFloat(orderAmount),
      sellerId: product.ownerId,
    };
  
    try {
      await dispatch(createOrder(orderData)).unwrap();
      setOrderAmount("");
      // Reload the page after successful order
      window.location.reload();
    } catch (error) {
      console.error("Order creation error:", error);
    }
  };
  

  // Filter products based on the switch and additional filters
  const filteredProducts = products
    .filter(
      (product) => (viewAuctions ? product.upForAuction : true) // Show all if switch is off
    )
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory ? product.category === filterCategory : true)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.basePrice - b.basePrice;
        case "price-desc":
          return b.basePrice - a.basePrice;
        case "date":
          return new Date(b.harvestDate) - new Date(a.harvestDate);
        default:
          return 0;
      }
    });

  const categories = [...new Set(products.map((p) => p.category))];
  console.log(categories);
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6 space-x-4">
       {/* Switch for Auction/All Products */}
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only peer"
    checked={viewAuctions}
    onChange={() => setViewAuctions(!viewAuctions)}
  />
  <div
    className="group peer bg-white rounded-full duration-300 w-16 h-8 ring-2 
    ring-gray-500 after:duration-300 after:bg-gray-500 peer-checked:after:bg-green-500 
    peer-checked:ring-green-500 after:rounded-full after:absolute after:h-6 after:w-6 
    after:top-1 after:left-1 after:flex after:justify-center after:items-center 
    peer-checked:after:translate-x-8 peer-hover:after:scale-95"
  ></div>
</label>
<span
  className={`ml-3 text-sm font-medium ${
    viewAuctions ? "text-green-600" : "text-gray-600"
  }`}
>
  {viewAuctions ? "Showing Auction Products" : "Showing All Products"}
</span>



        {/* Search Bar */}
        <Input
          placeholder="Search products..."
          value={searchTerm}
          width="240px"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />

        {/* Filter by Category */}
        {/* <Select onValueChange={setFilterCategory} value={filterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>

      {/* Loading and Error Handling */}
      {loading && <div>Loading products...</div>}
      {error && <div>Error: {error}</div>}

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDetails={() => handleProductDetails(product)}
            onPlaceBid={() => handleBid(product)}
            onPlaceOrder={() => handlePlaceOrder(product)}
          />
        ))}
      </div>

      {/* Product Dialog */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* No Products Found */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-10">{t("noProductsFound")}</div>
      )}
    </div>
  );
};

export default ProductList;
