import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const nav = [
    { label: "Dashboard", to: "/admin" },
    { label: "Users", to: "/admin/users" },
  ];

  return (
    <div className="w-60 bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`p-2 rounded mb-2 ${
            pathname === item.to ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
