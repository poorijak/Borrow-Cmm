"use client";

import api from "@/lib/axios";
import { useState } from "react";

export default function TestAuthButton() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckAuth = async () => {
    setLoading(true);
    try {
      // เมื่อกดปุ่มนี้ ถ้า Access Token หมดอายุ 
      // Interceptor จะทำงานอัตโนมัติ (ยิง /refresh -> ยิง /me ซ้ำ)
      const res = await api.get("/auth/me");
      setData(res.data);
      console.log("Success:", res.data);
    } catch (err) {
      console.error("Final Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <button 
        onClick={handleCheckAuth}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        {loading ? "Checking..." : "Verify Auth & Trigger Interceptor"}
      </button>

      {data && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}