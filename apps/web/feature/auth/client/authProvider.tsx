"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type authProvider = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: authProvider) => {
  const router = useRouter();
  useEffect(() => {
    const syncAuth = async () => {
      try {
        await api.get("/auth/me");
      } catch (error) {
        router.push("/auth/sigin");
      }
    };
    syncAuth();
  }, [router]);
  return <>{children}</>;
};
