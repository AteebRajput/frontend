import { useEffect, useState } from "react";
import { Package, MapPin, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/product-ui/Dialog";
import { Button } from "../ui/product-ui/Button";

import { Scale, Timer, AlertCircle } from "lucide-react";
import { Badge } from "../ui/Badge";

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
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
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
                    product.images?.[activeImage] || "/api/placeholder/400/300"
                  }
                  alt={product.name}
                  className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-4 right-4 shadow-xl ${
                    product.status === "active"
                      ? "bg-green-500/90 hover:bg-green-500"
                      : product.status === "sold"
                      ? "bg-blue-500/90 hover:bg-blue-500"
                      : product.status === "expired"
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
                      Auction Status
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-900 mb-2">
                    {timeLeft ? timeLeft : "Loading..."}
                  </p>
                  <p className="text-sm text-amber-700">
                    Ends: {formatDate(product.bidEndTime)}{" "}
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
                      <span className="font-medium">Base Price</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      ₨ {product.basePrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="font-medium">Quantity</span>
                    </div>
                    <span className="text-lg font-bold text-gray-700">
                      {product.quantity} {product.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">Location</span>
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
                Product Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">
                    {product.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quality Grade</p>
                  <p className="font-medium text-gray-800">{product.quality}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-800">
                Important Dates
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Harvest Date</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(product.harvestDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
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
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail