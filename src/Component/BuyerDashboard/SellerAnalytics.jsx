import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllSellersAnalytics } from "../../../slices/analyticsSlice"; // update path as needed
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/product-ui/Avatar";
import { Link } from "react-router-dom";

export default function Sellers() {
  const dispatch = useDispatch();

  const { sellersAnalytics, loading, error } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchAllSellersAnalytics());
  }, [dispatch]);

  console.log(sellersAnalytics);
  

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-3xl font-bold text-black ">AgriTech Empowering Farmers</h1>
          <div className="flex items-center gap-4">
            {/* <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sellers..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-full"
              />
            </div> */}
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              {/* <AvatarFallback>U</AvatarFallback> */}
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">Seller Analytics</h2>
            <p className="text-muted-foreground">
              View detailed performance metrics for all sellers on the platform.
            </p>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="grid gap-6">
              {sellersAnalytics.map((seller) => (
                <Link key={seller._id || seller.id} to={`/buyer-dashboard/sellers/${seller._id || seller.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`/placeholder.svg?text=${seller.name?.charAt(0)}`}
                              alt={seller.name}
                            />
                            <AvatarFallback>{seller.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{seller.name}</h3>
                            <p className="text-sm text-muted-foreground">{seller.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">Products</p>
                            <p className="text-sm">{seller.totalProducts}</p>
                          </div>
                          {/* <div className="text-right">
                            <p className="text-sm font-medium">Rating</p>
                            <p className="text-sm">{seller.rating}/5</p>
                          </div> */}
                          <div className="text-right">
                            <p className="text-sm font-medium">Completion</p>
                            <p className="text-sm">{seller.completionPercentage}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Total Sales</p>
                            <p className="text-sm">
                              Rs. {seller.totalSales?.toLocaleString() || 0}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
