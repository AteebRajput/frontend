import { useState } from "react";
import { Clock, DollarSign, Medal, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/product-ui/Dialog";
import { Badge } from "../../ui/Badge";
import { Separator } from "../../ui/Separator";
import profilePic from "../../../../public/icon-7797704_1280.png"
import { useSelector } from "react-redux";
import { formatCurrency, formatDate } from "../../../lib/utils";

export default function AuctionDetailsDialog({ auctionId, open, onOpenChange }) {
  const { bids, loading, error } = useSelector((state) => state.auctions);

  // Find the auction related to this auctionId
  const auction = bids.find((bid) => bid.auctionId._id === auctionId);
  console.log("Auction detail", auctionId);

  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = auction?.productId?.images || ["/placeholder.svg"];

  // Functions to handle image navigation
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getUserBidRank = (bidders) => {
    const userId = JSON.parse(localStorage.getItem("userId"))?.userId;
    if (!bidders || bidders.length === 0 || !userId) return null;

    // Sort bidders by amount in descending order
    const sortedBidders = [...bidders].sort((a, b) => b.amount - a.amount);

    // Find all bids placed by the logged-in user
    const userBids = sortedBidders.filter((bid) => bid.bidder === userId);
    if (userBids.length === 0) return null; // User has not placed any bid

    // Get the highest bid amount of the user
    const highestUserBid = Math.max(...userBids.map((bid) => bid.amount));

    // Get the rank of the user's highest bid in the sorted array
    const rank =
      sortedBidders.findIndex((bid) => bid.amount === highestUserBid) + 1;

    // Convert rank to ordinal format (1st, 2nd, 3rd, etc.)
    const ordinalSuffix = (num) => {
      if (num === 1) return `${num}st`;
      if (num === 2) return `${num}nd`;
      if (num === 3) return `${num}rd`;
      return `${num}th`;
    };

    return ordinalSuffix(rank);
  };

  const getStatusBadge = (status, bidRank) => {
    if (status === "active") return <Badge className="bg-green-400">Active</Badge>;
    return bidRank === 1 ? <Badge className="bg-blue-500">Won</Badge> : <Badge className="bg-red-500">Lost</Badge>;
  };

  if (loading) return <p className="text-center">Loading auction details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!auction) return <p className="text-center">Auction not found</p>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] top-[500px] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{auction.auctionId.title}</DialogTitle>
            {getStatusBadge(auction.auctionId.status, auction.bidRank)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel */}
          <div className="relative aspect-video">
            <img
              src={images[currentImageIndex]}
              alt={`Product Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-2 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft />
                </button>
                <button
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-800 bg-opacity-60 text-white p-2 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Auction Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Auction Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Start: {formatDate(auction.auctionId.startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>End: {auction.auctionId.endTime ? formatDate(auction.auctionId.endTime) : "No end time available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Base Price: {formatCurrency(auction.auctionId.basePrice)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Highest Bid: {formatCurrency(auction.auctionId.highestBid.amount)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Your Bid Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Bid Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Your Bid: {formatCurrency(auction.amount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Bid Time: {formatDate(auction.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-muted-foreground" />
                <span>
                  Your Rank: {getUserBidRank(auction.auctionId.bidders)}
                  
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Description</h3>
            <p className="text-muted-foreground">{auction.productId.description}</p>
          </div>

          <Separator />

          {/* Seller Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
            <div className="flex items-center gap-3">
              <img
                src={profilePic || "/placeholder.svg"}
                alt={auction.auctionId.sellerName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{auction.productOwnerId.name}</p>
                <p className="text-sm text-muted-foreground">Seller</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
