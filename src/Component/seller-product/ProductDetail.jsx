import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package, Scale, Timer, AlertCircle } from "lucide-react";

const ProductDetail = ({ product, onClose }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (product.upForAuction && product.bidEndTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(product.bidEndTime);
        const diff = end - now;

        if (diff <= 0) {
          setTimeLeft('Auction Ended');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product.bidEndTime]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Main Image */}
          <div className="relative">
            <img
              src={product.images?.[0] || "/api/placeholder/400/300"}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge 
              className={`absolute top-4 right-4 ${
                product.status === 'active' ? 'bg-green-500' :
                product.status === 'sold' ? 'bg-blue-500' :
                product.status === 'expired' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}
            >
              {product.status.toUpperCase()}
            </Badge>
          </div>

          {/* Auction Timer */}
          {product.upForAuction && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-600">Auction Status</h3>
              </div>
              <p className="text-amber-800">
                {timeLeft ? `Time Remaining: ${timeLeft}` : 'Loading...'}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                End Time: {formatDate(product.bidEndTime)} {new Date(product.bidEndTime).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Description */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold">Base Price</p>
                <p className="text-gray-600">${product.basePrice}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold">Quantity</p>
                <p className="text-gray-600">{product.quantity} {product.unit}</p>
              </div>
            </div>

            {/* Category and Quality */}
            <div>
              <p className="font-semibold">Category</p>
              <p className="text-gray-600">{product.category}</p>
            </div>

            <div>
              <p className="font-semibold">Quality Grade</p>
              <p className="text-gray-600">{product.quality}</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-gray-600">{product.location}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold">Harvest Date</p>
                <p className="text-gray-600">{formatDate(product.harvestDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold">Expiry Date</p>
                <p className="text-gray-600">{formatDate(product.expiryDate)}</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {product.images && product.images.length > 1 && (
            <div>
              <h3 className="font-semibold mb-2">More Images</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image || "/api/placeholder/100/100"}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;