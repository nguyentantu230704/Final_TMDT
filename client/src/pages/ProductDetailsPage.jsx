import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ShoppingCart, Share2 } from "react-feather";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import api from "../api";
import { CartContext, UserContext } from "@/App";

//import mới
import { Helmet } from "react-helmet-async";

export default function ProductDetailsPage() {
  const { user } = useContext(UserContext);
  const { cart, cartDispatch } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const resp = await api.fetchProduct(id);
      if (resp.status == "error") {
        return history.replace("/404");
      }
      setProduct(resp);
    })();
  }, [id]);

  const addToCart = async (e, quantity = 1) => {
    if (user) {
      const resp = await api.addProductsToCart([{ productID: id, quantity }]);
      if (resp.status === "ok") {
        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: [{ ...product, quantity }],
        });
      }
    } else {
      cartDispatch({
        type: "ADD_PRODUCTS",
        payload: [{ ...product, quantity }],
      });
    }
  };

  if (!product) return <Loader />;

  const pageUrl = `https://tmdt-app.vercel.app/products/${id}`;

  return (
    <>
      <Helmet>
        {/* OG meta tags */}
        <title>{product.title}</title>
        <meta name="description" content={product.description} />

        {/* Open Graph */}
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="product" />

        {/* Share lên zalo */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

      <main className="relative mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 py-8 px-4">
          <section className="flex items-center max-h-2xl overflow-hidden my-10 sm:mx-0">
            <img className="object-cover" src={product.image} />
          </section>
          <section className="flex flex-col justify-center space-y-6 text-gray-600">
            <h2 className="text-4xl text-gray-800">{product.title}</h2>
            <p className="text-xl">{product.description}</p>
            <span className="text-2xl font-medium">${product.price}</span>
            {cart.products.some((p) => p.id === id) ? (
              <Link to="/cart">
                <Button link className="sm:max-w-xs text-base">
                  <Check className="mr-2" />
                  <span>Added to Cart</span>
                </Button>
              </Link>
            ) : (
              <Button className="sm:max-w-xs text-base" onClick={addToCart}>
                <ShoppingCart className="opacity-80 mr-4" />
                <span>Add to Cart</span>
              </Button>
            )}

            {/* chèn nút share fb dưới đây */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-xs items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200"
            >
              {/* Icon Facebook SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.86 3.44 8.9 7.94 9.8v-6.94H7.08v-2.86h2.86V9.41c0-2.82 1.68-4.38 4.26-4.38 1.23 0 2.52.22 2.52.22v2.77h-1.42c-1.4 0-1.84.87-1.84 1.76v2.11h3.13l-.5 2.86h-2.63v6.94c4.5-.9 7.94-4.94 7.94-9.8z" />
              </svg>

              <span className="text-white">Share Facebook</span>
            </a>
          </section>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="absolute top-0 text-lg"
          secondary
        >
          <ChevronLeft className="mr-2" /> Back
        </Button>
      </main>
    </>
  );
}
