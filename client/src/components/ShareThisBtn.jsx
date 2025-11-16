import { useEffect } from "react";

export default function ShareButtons({ pageUrl }) {
  useEffect(() => {
    // Kiểm tra nếu script chưa tồn tại thì mới tạo
    if (!document.getElementById("sharethis-script")) {
      const script = document.createElement("script");
      script.src =
        "https://platform-api.sharethis.com/js/sharethis.js#property=YOUR_PROPERTY_KEY&product=inline-share-buttons";
      script.id = "sharethis-script"; // đặt id để không thêm nhiều lần
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Nếu script đã load, khởi tạo lại ShareThis để render div mới
      window.__sharethis__?.initialize();
    }
  }, []);

  return (
    <div data-url={pageUrl} className="sharethis-inline-share-buttons"></div>
  );
}
