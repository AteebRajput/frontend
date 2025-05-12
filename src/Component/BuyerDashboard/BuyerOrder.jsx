import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../slices/orderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { useTranslation } from "react-i18next";

const BuyerOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [localOrders, setLocalOrders] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await dispatch(fetchOrders()).unwrap();
        setLocalOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersData();
  }, [dispatch]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const sortedOrders = [...(localOrders.length > 0 ? localOrders : orders)].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-black font-bold mb-4">My Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("orderId")}</TableHead>
            <TableHead>{t("seller")}</TableHead>
            <TableHead>{t("product")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("quantity")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("orderTime") || "Order Time"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.sellerId?.name || "N/A"}</TableCell>
              <TableCell>{order.productId?.name || "Auction Item"}</TableCell>
              <TableCell>${order.totalAmount?.toFixed(2) || "0.00"}</TableCell>
              <TableCell>{order.quantity ? `${order.quantity} Kg` : "-"}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BuyerOrder;
