import AuthFooter from "@/feature/auth/components/auth-footer";
import AuthHeader from "@/feature/auth/components/auth-header";
import AuthProvider from "@/feature/auth/components/auth-provider-signin";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthHeader>
        <AuthProvider />
        <AuthFooter />
      </AuthHeader>
    </div>
  );
};

export default page;
