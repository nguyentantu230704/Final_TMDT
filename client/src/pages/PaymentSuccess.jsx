import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import api from "../api";
import OrderItem from "@/components/OrderItem";
import NotFoundPage from "./404Page";

export default function PaymentSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const resp = await api.fetchOrderDetails(orderId);
      if (resp?.order) {
        setOrder(resp.order); //setOrder là hàm
      }
      setLoading(false);
    })();
  }, [orderId]);

  if (loading) {
    return <div>Đang tải đơn hàng... 1</div>;
  }

  if (!order) {
    return <NotFoundPage />;
  }

  console.log("DEBUG: ", order);

  return (
    <div className="flex flex-col justify-start items-center min-h-[60vh] p-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-40 h-40 text-green-500"
      >
        <path
          fillRule="evenodd"
          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>

      <h1 className="text-green-500 text-3xl mb-4 font-bold">
        Chúc mừng bạn đã thanh toán thành công
      </h1>
      <h1 className="text-red-600 text-xl mb-2 mt-10 font-bold">
        Thông tin đơn hàng
      </h1>
      <div
        className={clsx(
          "flex flex-col max-w-2xl",
          "border border-gray-300 rounded",
          "shadow",
          "px-2 py-4 mb-40",
          "sm:mx-auto"
        )}
      >
        {order?.products ? (
          <OrderItem
            products={order.products}
            status={order.status}
            amount={order.amount}
          />
        ) : (
          <div>Đang tải đơn hàng...</div>
        )}
      </div>
    </div>
  );
}
