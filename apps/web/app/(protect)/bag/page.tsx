import BagItems from "@/feature/bag/components/bag-items";
import { getUser } from "@/feature/users/server/user";
import React from "react";

const page = async () => {
  const user = await getUser();

  return (
    <div className="mt-5">
      <h1 className="pb-5 text-3xl font-bold">กระเป๋าของฉัน</h1>
      <BagItems userId={user?.id} />
    </div>
  );
};

export default page;
