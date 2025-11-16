import { useEffect } from "react";

export default function ShareButtons({ pageUrl }) {
  useEffect(() => {
    if (!document.getElementById("sharethis-script")) {
      const script = document.createElement("script");
      script.src =
        "https://platform-api.sharethis.com/js/sharethis.js#property=6919686890a70be8f33c0801&product=inline-share-buttons";
      script.id = "sharethis-script";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.__sharethis__?.initialize();
    }
  }, []);

  return (
    <div className="sharethis-inline-share-buttons" data-url={pageUrl}></div>
  );
}
