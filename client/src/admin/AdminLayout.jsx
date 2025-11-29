import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <Header />
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
