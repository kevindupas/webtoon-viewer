import axios from "axios";

export const fetcher = (url: string) => {
  const token = localStorage.getItem("token");
  return axios
    .get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};
