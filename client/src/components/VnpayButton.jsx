import React, { useContext, useState } from "react";
import { UserContext } from "../App.jsx";

const VnpayButton = ({ amount, address }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để thanh toán");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/vnpay/create_payment_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // nếu backend cần token
        },
        body: JSON.stringify({ amount, address }),
      });

      const data = await response.json();

      if (data.success) {
        // Chuyển hướng sang VNPay
        window.location.href = data.paymentUrl;
      } else {
        alert("Không tạo được đường dẫn thanh toán");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      alert("Có lỗi xảy ra khi tạo thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white"
          }`}
      >
        {loading && (
          <svg
            className="w-5 h-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
        )}
        {loading ? "Đang tạo thanh toán..." : "Thanh toán VNPay"}
      </button>
    </div>
  );
};

export default VnpayButton;
