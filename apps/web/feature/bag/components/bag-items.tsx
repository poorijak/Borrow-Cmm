"use client";

import React from "react";
import { useGetMyBag } from "../hooks/useMyBag";

interface BagItemsProps {
  userId?: string;
}

const BagItems = ({ userId }: BagItemsProps) => {
  const { data } = useGetMyBag(userId);

  console.log(data);

  return <div></div>;
};

export default BagItems;
