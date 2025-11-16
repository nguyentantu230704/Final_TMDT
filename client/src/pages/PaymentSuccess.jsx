import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex flex-col min-h-[60vh] justify-center items-center text-center p-6">
      {/* Icon thanh toán thành công */}
      <div className="mb-6">
        <svg
          className="w-24 h-24 text-green-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-green-600">
        Thanh toán thành công!
      </h1>
      <p className="text-gray-700 text-lg">
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý thành công.
      </p>
    </div>
  );
}
