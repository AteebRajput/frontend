import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/product-ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { useSelector } from "react-redux";

export default function BidsDetailsDialog({ auctionId, open, onOpenChange }) {
  const { bids, loading } = useSelector((state) => state.auctions);

  const username = JSON.parse(localStorage.getItem("user"))?.user?.name;
  // console.log("user",data);
  
  if (!auctionId || !Array.isArray(bids)) {
    console.warn("Invalid auctionId or bids array is missing.");
    return <p>Error loading bids.</p>;
  }

  // Find the correct auction using auctionId (ensuring string comparison)
  const auction = bids.find((bid) => String(bid.auctionId._id) === String(auctionId)) || null;


  // Extract bidders from the auction
  const bidders = auction?.auctionId?.bidders || [];
  const sortedBidders = [...bidders].sort((a, b) => b.amount - a.amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">All Bids - {auction?.productId?.name || "Unknown"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading bids...</p>
        ) : bidders.length > 0 ? (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBidders.map((bid, index) => (
                    <TableRow key={bid._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{ bid.bidderName === username ? `${bid.bidderName}(You)` : bid.bidderName}</TableCell>
                      <TableCell>{formatCurrency(bid.amount)}</TableCell>
                      <TableCell>{formatDate(bid.createdAt)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>No bids available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
