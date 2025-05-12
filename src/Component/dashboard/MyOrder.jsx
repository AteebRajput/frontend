import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  updateOrderStatus,
  fetchFarmerOrders,
  deleteOrder, // Import the delete thunk
} from "../../../slices/orderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { Button } from "../ui/Button";
import { toast } from "react-toastify"; // For notifications

const MyOrders = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFarmerOrders()); // Fetch farmer's orders on component mount
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }))
      .unwrap()
      .then(() => toast.success(`Order status updated to ${status}`))
      .catch((err) => toast.error(`Error: ${err}`));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
      dispatch(fetchFarmerOrders()); // Refresh the orders after deletion
    }
  };

  if (loading) return <div>{t("loadingOrder")}</div>;
  // if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t("farmerOrder")}</h1>
      <Table>
        <TableHeader>
          <TableRow className="text-lg bg-green-100">
            <TableHead>{t("orderId")}</TableHead>
            <TableHead>{t("winnerbuyer")}</TableHead>
            <TableHead>{t("productOrder")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("statusOrder")}</TableHead>
            <TableHead>{t("actionsOrder")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-md">
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.buyerId?.name || "N/A"}</TableCell>
              <TableCell>{order.productId?.name || "N/A"}</TableCell>
              <TableCell>${order.unitPrice ? order.unitPrice.toFixed(2) : order.bidAmount.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(order._id, "completed")}
                >
                  {t("markAsCompleted")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatusChange(order._id, "cancelled")}
                >
                  {t("cancelOrder")}
                </Button>
                <Button
                  size="sm"
                  variant="danger" // Use a different variant for delete
                  onClick={() => handleDeleteOrder(order._id)} // Handle delete
                >
                  {t("delete")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyOrders;
