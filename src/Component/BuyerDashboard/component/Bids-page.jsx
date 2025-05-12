import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpecifBids } from "../../../../slices/auctionSlice"; // Adjust path as needed
import {
  Clock,
  DollarSign,
  Eye,
  Info,
  Medal,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "../../ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import AuctionDetailsDialog from "./Auction-Detail";
import BidsDetailsDialog from "./Bid-detail";
import { formatCurrency, formatDate } from "../../../lib/utils";

export default function BidsPage() {
  const dispatch = useDispatch();
  const { bids, loading, error } = useSelector((state) => state.auctions);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isAuctionDetailsOpen, setIsAuctionDetailsOpen] = useState(false);
  const [isBidsDetailsOpen, setIsBidsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchBids = () => {
      const storedUser = localStorage.getItem("userId");
      const userId = storedUser ? JSON.parse(storedUser).userId : null;
      if (userId) {
        dispatch(getUserSpecifBids(userId));
      }
    };
  
    fetchBids(); // Initial Fetch
    const interval = setInterval(fetchBids, 100000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval); // Cleanup
  }, [dispatch]);
  
  

  const getStatusBadge = (status, bidRank) => {
    if (status === "active")
      return <Badge className="bg-green-400">Active</Badge>;
    return bidRank === '1st' ? (
      <Badge className="bg-blue-500">Won</Badge>
    ) : (
      <Badge className="bg-red-500">Lost</Badge>
    );
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

  const getUserHighestBid = (bidders) => {
    const userId = JSON.parse(localStorage.getItem("userId"))?.userId;
    if (!bidders || bidders.length === 0 || !userId) return null;

    // Filter bids placed by the logged-in user
    const userBids = bidders.filter((bid) => bid.bidder === userId);
    if (userBids.length === 0) return null; // No bids placed by the user

    // Get the highest bid amount
    const highestBid = Math.max(...userBids.map((bid) => bid.amount));

    return highestBid;
  };

  const openAuctionDetails = (auction) => {

    setSelectedAuction(auction);
    console.log("selected auction",selectedAuction);
    setIsAuctionDetailsOpen(true);
  };

  const openBidsDetails = (auction) => {
    setSelectedAuction(auction);
    setIsBidsDetailsOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-20">
        <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
    );
  

    if (error)
        return (
          <div className="text-red-500 bg-red-100 p-4 rounded-md border border-red-400">
            { "You don't have any bid right now."}
          </div>
        );
      
        if (!bids || bids.length === 0)
            return (
              <div className="text-gray-600 bg-gray-100 p-6 rounded-md text-center">
                <p className="text-lg">No bids found.</p>
                <p className="text-sm text-gray-500">Start bidding on a product to see your bids here.</p>
              </div>
            );
          
    // if (!loading && bids.length === 0) {
    //     return (
    //       <div className="text-center text-gray-500 mt-10">
    //         <p>No bids found. Start bidding on products!</p>
    //       </div>
    //     );
    //   }
    console.log("bids", bids);
    
      

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Bids</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(
          bids.reduce((acc, bid) => {
            acc[bid.auctionId._id] = bid; // Store only the most recent bid per auction
            return acc;
          }, {})
        ).map((bid) => (
          <Card key={bid._id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl line-clamp-2">
                  {bid.productId.name}
                </CardTitle>
                {getStatusBadge(
                  bid.auctionId.status,
                  getUserBidRank(bid.auctionId.bidders)
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video relative mb-4">
                <img
                  src={bid.productId.images[0] || "/placeholder.svg"}
                  alt={bid.auctionTitle}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {bid.auctionId.status === "active" && bid.auctionId.endTime
                      ? `Ends: ${formatDate(bid.auctionId.endTime)}`
                      : bid.auctionId.endTime
                      ? `Ended: ${formatDate(bid.auctionId.endTime)}`
                      : "No end time available"}
                  </span>
                 
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Your bid:{" "}
                    {formatCurrency(getUserHighestBid(bid.auctionId.bidders))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Highest bid:{" "}
                    {formatCurrency(bid.auctionId.highestBid.amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Medal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Your rank: {getUserBidRank(bid.auctionId.bidders)}
                    {/* {bid.bidRank === 1 ? "st" : bid.bidRank === 2 ? "nd" : bid.bidRank === 3 ? "rd" : "th"} */}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Seller: {bid.productOwnerId.name} |{" "}
                    {bid.productOwnerId.company}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => openAuctionDetails(bid.auctionId._id)}
              >
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => openBidsDetails(bid.auctionId._id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                All Bids
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedAuction && (
        <>
          <AuctionDetailsDialog
            auctionId={selectedAuction}
            open={isAuctionDetailsOpen}
            onOpenChange={setIsAuctionDetailsOpen}
          />
          <BidsDetailsDialog
            auctionId={selectedAuction}
            open={isBidsDetailsOpen}
            onOpenChange={setIsBidsDetailsOpen}
          />
        </>
      )}
    </div>
  );
}
