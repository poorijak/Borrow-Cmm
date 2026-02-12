import StepperForm from "@/feature/checkout/components/stepperform";
import { getUser } from "@/feature/users/server/user";
import React from "react";

const page = async () => {
  const user = await getUser();

  return (
    <div>
      <StepperForm user={user} />
    </div>
  );
};

export default page;
