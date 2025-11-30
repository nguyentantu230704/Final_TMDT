import React from "react";
import Navbar from "@/ui/Navbar";
import Footer from "@/ui/Footer";
import { Outlet } from "react-router-dom";
import ChatWidgets from "@/components/ChatWidgets";
import TawkTo from "@/components/TawkTo";

function UserLayout({}) {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />

      {/* Chat widget buttons: Fixed position bottom-right icons for Zalo & Facebook */}
      <ChatWidgets />
      <TawkTo />
    </>
  );
}

export default UserLayout;
