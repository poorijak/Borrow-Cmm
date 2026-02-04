import React from "react";

interface UserHeaderProps {
  type: "User-management" | "Staff-management";
}

const UserHeader = ({ type }: UserHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        {type === "User-management" ? "จัดการผู้ใช้" : "จัดการเจ้าหน้าที่"}
      </h1>
    </div>
  );
};

export default UserHeader;
