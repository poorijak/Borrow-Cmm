import axios from "axios";

export const getUser = async () => {
  try {
    const res = await axios.get(`${process.env.API_URL}/auth/me`, {
      withCredentials: true, // ⭐ สำคัญมาก (ส่ง cookie)
    });

    return res.data;
  } catch (err) {
    return null;
  }
};
