import { createContext, useContext, useState, useEffect } from "react";

//tạo context
const AdminContext = createContext();

//Custom hook tiện dụng
export const useAdmin = () => useContext(AdminContext);

//provider
export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null); // thông tin user {id, username, role}
  const [loading, setLoading] = useState(true); // trạng thái đang fetch
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`${API_URL}/`);
      } catch (error) {}
    };
  });
};
