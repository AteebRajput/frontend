import  { useState, useEffect } from "react";
import { useCallback } from "react";
import { Clock, Tag, ShoppingCart, Gavel, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Alert, AlertDescription } from "../ui/product-ui/Alert";
import { fetchAuctionDetails, placeBid } from "../../../slices/auctionSlice";
import { createOrder } from "../../../slices/orderSlice";
import { toast } from "react-toastify";
import ChatButton from "../chat/ChatButton";


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/product-ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/product-ui/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTheProducts } from "../../../slices/productSlice";

const REFRESH_INTERVAL = 10000;

const ProductCard = ({ product, onDetails, onPlaceOrder }) => {
  const dispatch = useDispatch();
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState("");
  const { orderStatus } = useSelector((state) => state.orders);
  const [isChatOpen,setIsChatOpen] = useState(false)

  const fetchLatestAuctionDetails = useCallback(async () => {
    try {
      const details = await dispatch(fetchAuctionDetails(product._id)).unwrap();
      console.log("Auction Details are these: ", details);

      setAuctionDetails(details);
    } catch (error) {
      console.error("Error fetching auction details:", error);
      // Don't show error message for background refreshes
    }
  }, [dispatch, product._id]);

const currentUserId = JSON.parse(localStorage.getItem("userId")).userId

  const isAuctionActive =
    product.upForAuction && new Date(product.bidEndTime) > new Date();

  useEffect(() => {
    if (isBidDialogOpen && isAuctionActive) {
      // Initial fetch
      fetchLatestAuctionDetails();

      // Set up interval
      const interval = setInterval(fetchLatestAuctionDetails, REFRESH_INTERVAL);
      setRefreshInterval(interval);

      // Cleanup
      return () => {
        clearInterval(interval);
        setRefreshInterval(null);
      };
    }
  }, [isBidDialogOpen, isAuctionActive, fetchLatestAuctionDetails]);
  console.log("Chat open: ",isChatOpen);
  
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const handleOrderDialogOpen = () => {
    setError("");
    setSuccess("");
    setIsOrderDialogOpen(true);
  };

  const handleOrderDialogClose = () => {
    setIsOrderDialogOpen(false);
    setError("");
    setSuccess("");
    setOrderQuantity("");
  };

  const handleOrderSubmit = async () => {
    setError("");
    setSuccess("");

    // Validate order quantity
    const numericQuantity = parseInt(orderQuantity);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    if (numericQuantity > product.quantity) {
      setError("Order quantity cannot exceed available quantity");
      return;
    }

    // if (product.minQuantity && numericQuantity < product.minQuantity) {
    //   setError(`Minimum order quantity is ${product.minQuantity}`);
    //   return;
    // }

    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("userId")).userId;

      const orderData = {
        productId: product._id,
        buyerId: userId,
        quantity: numericQuantity,
      };
      console.log("Order Data:", orderData);

      const response = await dispatch(createOrder(orderData)).unwrap();
      console.log("Order Response:", response.message); // Log the response
      if (orderStatus == true) {
        setSuccess("Order placed successfully");

        dispatch(fetchAllTheProducts());
      }

      setSuccess("Order placed successfully!");
      setOrderQuantity("");

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        handleOrderDialogClose();
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBidDialogOpen = async () => {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const details = await dispatch(fetchAuctionDetails(product._id)).unwrap();
      setAuctionDetails(details);
      setIsBidDialogOpen(true);
    } catch (error) {
      setError("Failed to fetch auction details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBidDialogClose = () => {
    setIsBidDialogOpen(false);
    setError("");
    setSuccess("");
    setBidAmount("");
    setAuctionDetails(null);
  };

  const handleBidSubmit = async () => {
    setError("");
    setSuccess("");

    // Validate bid amount
    const numericBidAmount = parseFloat(bidAmount);
    if (isNaN(numericBidAmount) || numericBidAmount <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    if (numericBidAmount <= auctionDetails.highestBid) {
      setError("Bid amount must be higher than the current highest bid");
      return;
    }
    if (numericBidAmount <= product.basePrice) {
      setError("Bid amount must be higher than the current highest bid");
      return;
    }

    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("userId")).userId;
      await dispatch(
        placeBid({
          bidderId: userId,
          bidAmount: numericBidAmount,
          productId: product._id,
        })
      ).unwrap();

      // Refresh auction details after successful bid
      const updatedDetails = await dispatch(
        fetchAuctionDetails(product._id)
      ).unwrap();
      setAuctionDetails(updatedDetails);
      setSuccess("Bid placed successfully!");
      setBidAmount("");
    } catch (error) {
      console.log("Error", error);

      setError(error.message || "Failed to place bid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeInMs) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  return (
    <Card className="flex flex-col h-full bg-white">
      <CardHeader className="p-4 space-y-2">
        <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
          <img
            src={product.images[0] || "/api/placeholder/300/200"}
            alt={product.name}
            className="object-cover w-full h-48 rounded-lg"
          />
          {isAuctionActive && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Gavel className="w-4 h-4 mr-1" />
                Auction Live
              </span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-semibold truncate">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">
            Base Price: {formatCurrency(product.basePrice)}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">
            Quantity: {product.quantity} {product.unit}
          </span>
        </div>

        {isAuctionActive && (
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">
              Ends: {formatDate(product.bidEndTime)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 rounded-b-lg flex flex-col gap-3">
  {/* Group View Details & Place Order in a Grid */}
  <div className="grid grid-cols-2 gap-3 w-full">
    <Button variant="outline" onClick={onDetails} className="w-full">
      View Details
    </Button>

    {isAuctionActive ? (
      <Button
        variant="default"
        onClick={handleBidDialogOpen}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? "Loading..." : "Place Bid"}
      </Button>
    ) : (
      <Button
        variant="default"
        onClick={handleOrderDialogOpen}
        className="w-full bg-green-500 hover:bg-green-700 text-white"
      >
        Place Order
      </Button>
    )}
  </div>



  {/* Chat with Seller Button - Full Width Below */}
  {/* <Button className="w-full bg-gradient-to-b from-green-500 to-emerald-800" onClick={() => setIsChatOpen(true)}>
    Chat with Seller
  </Button> */}
  <ChatButton 
      currentUserId={currentUserId}
      sellerId={product.seller}
      sellerName={product.name}
      productId={product._id}
      productName={product.name}
      productImage={product.images[0]}
      />
</CardFooter>
{console.log(product)
}
{/* <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        sellerId={product.seller}
        sellerName={product.name}
        productId={product._id}
        productName={product.name}
      /> */}
      
      <Dialog
        className="bg-gray-500"
        open={isBidDialogOpen}
        onOpenChange={handleBidDialogClose}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-3">
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              Current auction status and bidding information
            </DialogDescription>
          </DialogHeader>

          {auctionDetails ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Current Highest Bid
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(auctionDetails.highestBid)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Total Bidders
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {auctionDetails.totalBidders}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Time Remaining
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(auctionDetails.remainingTime)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Base Price
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(product.basePrice + 1)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bidAmount"
                  className="text-sm font-medium text-gray-700"
                >
                  Your Bid Amount
                </label>
                <Input
                  id="bidAmount"
                  type="number"
                  min={auctionDetails.highestBid + 1}
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  className="w-full"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mt-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          <DialogFooter className="gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleBidDialogClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBidSubmit}
              disabled={loading || !bidAmount || !auctionDetails}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Placing Bid..." : "Confirm Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      

      {/* {Order dialog box} */}
      <Dialog open={isOrderDialogOpen} onOpenChange={handleOrderDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-3">
            <DialogTitle>Place Your Order</DialogTitle>
            <DialogDescription>
              Please specify the quantity you want to order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Available Quantity
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {product.quantity} {product.unit}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Price per {product.unit}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(product.basePrice)}
                </p>
              </div>
              {product.minQuantity && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Minimum Order
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {product.minQuantity} {product.unit}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="orderQuantity"
                className="text-sm font-medium text-gray-700"
              >
                Order Quantity ({product.unit})
              </label>
              <Input
                id="orderQuantity"
                type="number"
                min={product.minQuantity || 1}
                max={product.quantity}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                placeholder={`Enter quantity (${product.unit})`}
                className="w-full"
              />
              {orderQuantity && (
                <p className="text-sm text-gray-600 mt-2">
                  Total Price:{" "}
                  {formatCurrency(orderQuantity * product.basePrice)}
                </p>
              )}
            </div>

            {success && (
              <Alert variant="success" className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleOrderDialogClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOrderSubmit}
              disabled={loading || !orderQuantity}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCard;
