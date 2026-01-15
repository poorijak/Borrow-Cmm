import React from "react";

interface CategoryDetailPageProps {
  params: { id: string };
}
const page = ({ params }: CategoryDetailPageProps) => {
  const { id } = params;

  return <div>{id}</div>;
};

export default page;
