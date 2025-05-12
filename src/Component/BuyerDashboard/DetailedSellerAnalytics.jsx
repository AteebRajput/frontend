import {
  ArrowLeft,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/product-ui/Card"
import { useParams } from "react-router-dom"
import { Button } from "../ui/product-ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/product-ui/Avatar"
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
// import {
//   ChartContainer,
//   ChartGrid,
//   ChartLine,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartXAxis,
//   ChartYAxis,
// } from "../ui/product-ui/Chart"
// import ChartContainer from "../ui/product-ui/Chart.jsx"
import ChartContainer from "../ui/product-ui/Chart.jsx"
// import { fetchSellerDetailedAnalytics } from "../../../slices/analyticsSlice";
import { fetchSellerDetailedAnalytics } from "../../../slices/analyticsSlice"
import { useSelector,useDispatch } from "react-redux"
import { useEffect } from "react"

const DetailedSellerAnalytics = () => {
    const params = useParams();
    const sellerId = params.id;
    const dispatch = useDispatch();
    const { sellerDetailedAnalytics, loading, error } = useSelector((state) => state.analytics);
  
    useEffect(() => {
      dispatch(fetchSellerDetailedAnalytics(sellerId));
    }, [dispatch, sellerId]);
  
    const seller = {
      id: sellerId,
      name: sellerDetailedAnalytics?.basicInfo?.farmName || "Unknown Farm",
      location: sellerDetailedAnalytics?.basicInfo?.location || "Unknown",
      joinedDate: sellerDetailedAnalytics?.basicInfo?.joiningDate
        ? new Date(sellerDetailedAnalytics.basicInfo.joiningDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
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
    return <div>Loading seller analytics...</div>;
  }

  
  console.log("Revenue Graph Data:", seller.revenue);
  console.log("Orders Graph Data:", seller.orders);
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link> */}
            <h1 className="text-3xl text-black font-bold">Seller Analytics</h1>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
            {/* <AvatarFallback>U</AvatarFallback> */}
          </Avatar>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight">{seller.name}</h2>
              <p className="text-muted-foreground">
                {seller.location} • Joined {seller.joinedDate}
              </p>
            </div>
            {/* <Button>Contact Seller</Button> */}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {seller.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller.completionRate}%</div>
                <Progress value={seller.completionRate} className="mt-2 bg-green-500" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller.activeProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {seller.activeProducts} of {seller.totalProducts} products
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
  <TabsTrigger
    value="overview"
    className="data-[state=active]:bg-green-500 border rounded-xl data-[state=active]:text-white"
  >
    Overview
  </TabsTrigger>
  <TabsTrigger
    value="orders"
    className="data-[state=active]:bg-green-500 border rounded-xl data-[state=active]:text-white"
  >
    Orders
  </TabsTrigger>
  <TabsTrigger
    value="products"
    className="data-[state=active]:bg-green-500 border rounded-xl data-[state=active]:text-white"
  >
    Products
  </TabsTrigger>
  <TabsTrigger
    value="auctions"
    className="data-[state=active]:bg-green-500 border rounded-xl data-[state=active]:text-white"
  >
    Auctions
  </TabsTrigger>
</TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
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
                <Card>
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

              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Breakdown of order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <div className="text-3xl font-bold text-green-500">{seller.completedOrders}</div>
                      <p className="text-sm font-medium">Completed Orders</p>
                      <p className="text-xs text-muted-foreground">
                        {((seller.completedOrders / seller.totalOrders) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <div className="text-3xl font-bold text-yellow-500">{seller.pendingOrders}</div>
                      <p className="text-sm font-medium">Pending Orders</p>
                      <p className="text-xs text-muted-foreground">
                        {((seller.pendingOrders / seller.totalOrders) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <div className="text-3xl font-bold text-red-500">{seller.cancelledOrders}</div>
                      <p className="text-sm font-medium">Cancelled Orders</p>
                      <p className="text-xs text-muted-foreground">
                        {((seller.cancelledOrders / seller.totalOrders) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.totalProducts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.activeProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      {((seller.activeProducts / seller.totalProducts) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sold Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.soldProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      {((seller.soldProducts / seller.totalProducts) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expired Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.expiredProducts}</div>
                    <p className="text-xs text-muted-foreground">
                      {((seller.expiredProducts / seller.totalProducts) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution of products by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <div className="text-3xl font-bold text-emerald-500">8</div>
                      <p className="text-sm font-medium">Grains</p>
                      <p className="text-xs text-muted-foreground">33.3% of total</p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <div className="text-3xl font-bold text-blue-500">6</div>
                      <p className="text-sm font-medium">Vegetables</p>
                      <p className="text-xs text-muted-foreground">25% of total</p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <div className="text-3xl font-bold text-orange-500">10</div>
                      <p className="text-sm font-medium">Fruits</p>
                      <p className="text-xs text-muted-foreground">41.7% of total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auctions" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{seller.totalAuctions}</div>
                  </CardContent>
                </Card>
                <Card>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Auction Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((seller.successfulAuctions / seller.totalAuctions) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
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
    <TableCell>Rs. {auction.basePrice.toLocaleString()}</TableCell>
    <TableCell>Rs. {auction.finalPrice.toLocaleString()}</TableCell>
    <TableCell>{auction.bidders}</TableCell>
    <TableCell>
      <Badge
        className={ 
          auction.status === "completed"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }
      >
        {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
      </Badge>
    </TableCell>
  </TableRow>
))}



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
