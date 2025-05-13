import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTheProducts } from "../../../slices/productSlice";
import { placeBid } from "../../../slices/auctionSlice";
import { createOrder } from "../../../slices/orderSlice";
import ProductCard from "../ui/ProductCard";
import ProductDetail from "../ui/ProductDetail";
import { Input } from "../ui/Input";
import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { auctions } = useSelector((state) => state.auctions);
  const { t } = useTranslation(); // Initialize translation function

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("_all");
  const [sortBy, setSortBy] = useState("");
  const [viewAuctions, setViewAuctions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [orderAmount, setOrderAmount] = useState(""); // For placing order
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);

  // Predefined categories
  const predefinedCategories = ["Fruits", "Vegetables", "Grains", "Fertilizers", "Equipment"];

  // Get user ID once
  const userId = localStorage.getItem("userId");
  
  // Create a memoized refresh function
  const refreshProducts = useCallback(() => {
    dispatch(fetchAllTheProducts(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);
  
  // Add another effect to refresh data after order state changes
  useEffect(() => {
    if (!isOrderProcessing) {
      refreshProducts();
    }
  }, [isOrderProcessing, refreshProducts]);

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
      bidderId: userId,
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
    if (!product || isOrderProcessing) return;
    
    setIsOrderProcessing(true);
  
    const orderData = {
      productId: product._id,
      winnerId: userId,
      amount: parseFloat(orderAmount),
      sellerId: product.ownerId,
    };
  
    try {
      // Create the order
      await dispatch(createOrder(orderData)).unwrap();
      setOrderAmount("");
      
      // Force refresh the products list with a new dispatch
      const refreshAction = await dispatch(fetchAllTheProducts(userId));
      
      // Close product detail dialog if open
      if (selectedProduct && selectedProduct._id === product._id) {
        setSelectedProduct(null);
      }
      
      // If the redux action didn't update the state for some reason, force a local update
      // by creating a modified copy of the product with reduced quantity
      if (products.find(p => p._id === product._id)?.quantity === product.quantity) {
        console.log("Redux state not updating properly, forcing local update");
        const updatedProducts = products.map(p => {
          if (p._id === product._id) {
            return { ...p, quantity: p.quantity - parseFloat(orderAmount) };
          }
          return p;
        });
        
        // Dispatch a local action to update the products
        dispatch({ 
          type: 'products/updateProductsState',
          payload: updatedProducts 
        });
      }
    } catch (error) {
      console.error("Order creation error:", error);
    } finally {
      setIsOrderProcessing(false);
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
        (filterCategory === "_all" || product.category === filterCategory)
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

  // Get unique categories from products, filtering out null, undefined, and empty strings
  const existingCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  
  // Combine predefined and existing categories, removing duplicates
  const allCategories = [...new Set([...predefinedCategories, ...existingCategories])];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
        {/* Switch for Auction/All Products */}
        <div className="flex items-center">
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
            {viewAuctions ? "Auction Products" : "All Products"}
          </span>
        </div>

        {/* Filter Controls Container */}
        <div className="flex flex-wrap gap-3 flex-1">
          {/* Search Bar */}
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto sm:min-w-[240px] flex-grow"
          />

          {/* Filter by Category */}
          <Select onValueChange={setFilterCategory} value={filterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="_all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && <div className="text-center py-8">Loading products...</div>}
      {error && <div className="text-red-500 text-center py-8">Error: {error}</div>}

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDetails={() => handleProductDetails(product)}
            onPlaceBid={() => handleBid(product)}
            onPlaceOrder={() => handlePlaceOrder(product)}
            disabled={isOrderProcessing}
          />
        ))}
      </div>

      {/* Product Dialog */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onPlaceOrder={handlePlaceOrder}
          isProcessing={isOrderProcessing}
        />
      )}

      {/* No Products Found */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-10 py-8">{t("noProductsFound")}</div>
      )}
    </div>
  );
};

export default ProductList;