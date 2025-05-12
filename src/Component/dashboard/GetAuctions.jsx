import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAuctionBids } from "../../../slices/auctionSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/product-ui/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { Button } from "../ui/Button";
import { List } from "lucide-react";

const GetAuctions = ({ auctionId }) => {
  const dummyBids = [
    {
      _id: "1",
      bidder: { name: "John Doe" },
      amount: 250.5,
      createdAt: "2025-01-01T12:00:00Z",
    },
    {
      _id: "2",
      bidder: { name: "Jane Smith" },
      amount: 320.75,
      createdAt: "2025-01-02T14:30:00Z",
    },
    {
      _id: "3",
      bidder: { name: "Alice Johnson" },
      amount: 150.0,
      createdAt: "2025-01-03T10:15:00Z",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // Get bids and loading state from Redux
  //   const bids = useSelector(
  //     (state) => state.auctions.auctionBids[auctionId] || []
  //   );
  const loading = useSelector((state) => state.auctions.loading);
  const error = useSelector((state) => state.auctions.error);

  const bids = dummyBids;

  console.log("Bids in component:", bids);

  // Function to fetch and open bids
  const handleOpenBids = () => {
    setIsOpen(true);
    dispatch(fetchAuctionBids(auctionId));
  };

  return (
    <>
      {/* Button to open dialog */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleOpenBids}
        className="ml-2"
      >
        <List className="mr-2 w-4 h-4" /> View Bids
      </Button>

      {/* Dialog to show auction bids */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Auction Bids</DialogTitle>
          </DialogHeader>

          {/* Loading and Error Handling */}
          {loading ? (
            <div className="text-center py-4">Loading bids...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              Failed to fetch bids. Please try again.
            </div>
          ) : (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Bid Amount</TableHead>
                  <TableHead>Bid Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan="3"
                      className="text-center text-gray-500"
                    >
                      No bids placed yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  bids.map((bid, index) => (
                    <TableRow key={bid._id || index}>
                      <TableCell>{bid.bidder.name}</TableCell>
                      <TableCell>${bid.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(bid.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Close Button */}
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GetAuctions;
