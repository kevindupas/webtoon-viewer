import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const useFetch = () => {
  const { token, isAuthenticated } = useAuth();

  const fetcher = async (url: string) => {
    if (!isAuthenticated || !token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return { fetcher };
};

export default useFetch;
