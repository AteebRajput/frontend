import {
  Package,
  ShoppingCart,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  User,
  Building
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/product-ui/Card"
import { useParams } from "react-router-dom"

import { Avatar, AvatarImage } from "../ui/product-ui/Avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/product-ui/Tabs"
import { Badge } from "../ui/Badge"
import { Progress } from "../ui/product-ui/Progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table"
import ChartContainer from "../ui/product-ui/Chart.jsx"
import { fetchSellerDetailedAnalytics } from "../../../slices/analyticsSlice"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"

const DetailedSellerAnalytics = () => {
    const params = useParams();
    const sellerId = params.id;
    const dispatch = useDispatch();
    const { sellerDetailedAnalytics, loading, } = useSelector((state) => state.analytics);
  
    useEffect(() => {
      dispatch(fetchSellerDetailedAnalytics(sellerId));
    }, [dispatch, sellerId]);

    console.log("product stats",sellerDetailedAnalytics?.productStats?.byCategory?.Vegetables);
    
  
    const seller = {
      id: sellerId,
      name: sellerDetailedAnalytics?.basicInfo?.farmName || "Unknown Farm",
      location: sellerDetailedAnalytics?.basicInfo?.location || "Unknown",
      email: sellerDetailedAnalytics?.basicInfo?.email || "N/A",
      phone: sellerDetailedAnalytics?.basicInfo?.phone || "N/A",
      state: sellerDetailedAnalytics?.basicInfo?.state || "N/A",
      postalCode: sellerDetailedAnalytics?.basicInfo?.postalCode || "N/A",
      address: sellerDetailedAnalytics?.basicInfo?.address || "N/A",
      joinedDate: sellerDetailedAnalytics?.basicInfo?.joiningDate
        ? new Date(sellerDetailedAnalytics.basicInfo.joiningDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        : "Unknown",
      totalSales: sellerDetailedAnalytics?.businessMetrics?.totalRevenue || 0,
      totalOrders: sellerDetailedAnalytics?.businessMetrics?.totalOrders || 0,
      completedOrders: sellerDetailedAnalytics?.orderStats?.completed || 0,
      pendingOrders: sellerDetailedAnalytics?.orderStats?.pending || 0,
      cancelledOrders: sellerDetailedAnalytics?.orderStats?.cancelled || 0,
      completionRate: sellerDetailedAnalytics?.businessMetrics?.completionPercentage || 0,
      totalProducts: sellerDetailedAnalytics?.productStats?.totalProducts || 0,
      activeProducts: sellerDetailedAnalytics?.productStats?.activeProducts || 0,
      soldProducts: sellerDetailedAnalytics?.productStats?.soldProducts || 0,
      expiredProducts: sellerDetailedAnalytics?.productStats?.expiredProducts || 0,
      totalAuctions: sellerDetailedAnalytics?.auctionStats?.total || 0,
      successfulAuctions: sellerDetailedAnalytics?.auctionStats?.successful || 0,
      grains: sellerDetailedAnalytics?.productStats?.byCategory?.Grains || 0,
      fruits: sellerDetailedAnalytics?.productStats?.byCategory?.Fruits || 0,
      vegetables: sellerDetailedAnalytics?.productStats?.byCategory?.Vegetables || 0,
      equipment: sellerDetailedAnalytics?.productStats?.byCategory?.Equipment || 0,
      fertilizers: sellerDetailedAnalytics?.productStats?.byCategory?.Fertilizers || 0,
      revenue: sellerDetailedAnalytics?.graphData?.revenue?.map((item) => ({
        month: new Date(item.month + "-01").toLocaleString("default", { month: "short" }),
        value: item.value,
      })) || [],
      orders: sellerDetailedAnalytics?.graphData?.orders?.map((item) => ({
        month: new Date(item.month + "-01").toLocaleString("default", { month: "short" }),
        value: item.value,
      })) || [],
      recentOrders: sellerDetailedAnalytics?.recentOrders?.map((order) => ({
        id: order.id,
        product: order.productName,
        date: new Date(order.createdAt).toISOString().split("T")[0],
        amount: order.amount,
        status: order.status,
      })) || [],
      topProducts: sellerDetailedAnalytics?.topProducts?.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        unit: product.unit,
        sales: product.totalSales,
        orders: product.count,
      })) || [],
      recentAuctions: sellerDetailedAnalytics?.recentAuctions?.map((auction) => ({
        id: auction.id,
        product: auction.productName,
        basePrice: auction.basePrice,
        finalPrice: auction.finalPrice,
        bidders: auction.bidders,
        status: auction.status,
      })) || [],
    };
    
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading || !sellerDetailedAnalytics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium text-gray-700">Loading seller analytics...</div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl text-black font-bold">Seller Analytics</h1>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
          </Avatar>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          {/* Seller Profile Card - New Section */}
          <Card className="mb-6 overflow-hidden border-0 shadow-md">
            <div className="bg-green-500 h-16"></div>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {/* <Avatar className="h-24 w-24 border-4 border-white -mt-12 shadow-lg">
                    <AvatarImage src="/placeholder.svg" alt={seller.name} />
                  </Avatar> */}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 flex-grow">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{seller.name}</h2>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">Farm / Business</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Joined {seller.joinedDate}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{seller.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{seller.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {seller.address}, {seller.state} {seller.postalCode}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start justify-center">
                    <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-200">
                      <div className="text-xs px-1">{seller.completionRate}% Completion Rate</div>
                    </Badge>
                    <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <div className="text-xs px-1">{seller.totalOrders} Total Orders</div>
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      <div className="text-xs px-1">Rs. {seller.totalSales.toLocaleString()} Total Sales</div>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller.totalOrders}</div>
                <p className="text-xs text-gray-500">+15.2% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500 " />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller.completionRate}%</div>
                <Progress value={seller.completionRate} className="mt-2 bg-green-500" />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller.activeProducts}</div>
                <p className="text-xs text-gray-500">
                  {seller.activeProducts} of {seller.totalProducts} products
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {seller.totalSales.toLocaleString()}</div>
                <p className="text-xs text-gray-500">From {seller.completedOrders} completed orders</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="bg-white border shadow-sm">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="auctions"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Auctions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                    <CardDescription>Monthly revenue in Pakistani Rupees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer data={seller.revenue} xAxisKey="month" yAxisKey="value" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Orders Over Time</CardTitle>
                    <CardDescription>Monthly order count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer data={seller.orders} xAxisKey="month" yAxisKey="value" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Breakdown of order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-green-500">{seller.completedOrders}</div>
                      <p className="text-sm font-medium">Completed Orders</p>
                      <p className="text-xs text-gray-500">
                        {seller.totalOrders > 0 ? ((seller.completedOrders / seller.totalOrders) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-yellow-500">{seller.pendingOrders}</div>
                      <p className="text-sm font-medium">Pending Orders</p>
                      <p className="text-xs text-gray-500">
                        {seller.totalOrders > 0 ? ((seller.pendingOrders / seller.totalOrders) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-red-500">{seller.cancelledOrders}</div>
                      <p className="text-sm font-medium">Cancelled Orders</p>
                      <p className="text-xs text-gray-500">
                        {seller.totalOrders > 0 ? ((seller.cancelledOrders / seller.totalOrders) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best performing products by sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Sales</TableHead>
                        <TableHead>Orders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seller.topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            {product.quantity} {product.unit}
                          </TableCell>
                          <TableCell>Rs. {product.sales.toLocaleString()}</TableCell>
                          <TableCell>{product.orders}</TableCell>
                        </TableRow>
                      ))}
                      {seller.topProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No product data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest transactions with this seller</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seller.recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>Rs. {order.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`} />
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {seller.recentOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                            No recent orders available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.completedOrders}</div>
                    <Progress
                      value={(seller.completedOrders / seller.totalOrders) * 100}
                      className="mt-2"
                      indicatorColor="bg-green-500"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.pendingOrders}</div>
                    <Progress
                      value={(seller.pendingOrders / seller.totalOrders) * 100}
                      className="mt-2"
                      indicatorColor="bg-yellow-500"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.cancelledOrders}</div>
                    <Progress
                      value={(seller.cancelledOrders / seller.totalOrders) * 100}
                      className="mt-2"
                      indicatorColor="bg-red-500"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.totalProducts}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.activeProducts}</div>
                    <p className="text-xs text-gray-500">
                      {seller.totalProducts > 0 ? ((seller.activeProducts / seller.totalProducts) * 100).toFixed(1) : 0}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sold Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.soldProducts}</div>
                    <p className="text-xs text-gray-500">
                      {seller.totalProducts > 0 ? ((seller.soldProducts / seller.totalProducts) * 100).toFixed(1) : 0}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expired Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.expiredProducts}</div>
                    <p className="text-xs text-gray-500">
                      {seller.totalProducts > 0 ? ((seller.expiredProducts / seller.totalProducts) * 100).toFixed(1) : 0}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution of products by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-emerald-500">{seller.grains}</div>
                      <p className="text-sm font-medium">Grains</p>
                      {/* <p className="text-xs text-gray-500">33.3% of total</p> */}
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-blue-500">{seller.vegetables}</div>
                      <p className="text-sm font-medium">Vegetables</p>
                      {/* <p className="text-xs text-gray-500">25% of total</p> */}
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-orange-500">{seller.fruits}</div>
                      <p className="text-sm font-medium">Fruits</p>
                      {/* <p className="text-xs text-gray-500">41.7% of total</p> */}
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-yellow-500">{seller.equipment}</div>
                      <p className="text-sm font-medium">Equipment</p>
                      <p className="text-xs text-gray-500"></p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="text-3xl font-bold text-purple-500">{seller.fertilizers}</div>
                      <p className="text-sm font-medium">Fertilizers</p>
                      {/* <p className="text-xs text-gray-500">41.7% of total</p> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auctions" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.totalAuctions}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Successful Auctions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.successfulAuctions}</div>
                    <Progress
                      value={(seller.successfulAuctions / seller.totalAuctions) * 100}
                      className="mt-2"
                      indicatorColor="bg-green-500"
                    />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Auction Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {seller.totalAuctions > 0 ? ((seller.successfulAuctions / seller.totalAuctions) * 100).toFixed(1) : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Auctions</CardTitle>
                  <CardDescription>Latest auction activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Final Price</TableHead>
                        <TableHead>Bidders</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seller.recentAuctions.map((auction) => (
                        <TableRow key={auction.id}>
                          <TableCell className="font-medium">{auction.product}</TableCell>
                          <TableCell>Rs. {auction.basePrice ? auction.basePrice.toLocaleString() : 'N/A'}</TableCell>
                          <TableCell>Rs. {auction.finalPrice ? auction.finalPrice.toLocaleString() : 'N/A'}</TableCell>
                          <TableCell>{auction.bidders}</TableCell>
                          <TableCell>
                            <Badge
                              className={ 
                                auction.status === "completed"
                                  ? "bg-green-500 text-white"
                                  : auction.status === "expired"
                                    ? "bg-orange-500 text-white"
                                    : "bg-blue-500 text-white"
                              }
                            >
                              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {seller.recentAuctions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                            No recent auctions available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default DetailedSellerAnalytics