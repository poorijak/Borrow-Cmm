import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumLinkProps {
  items: BreadcrumbItem[];
  page?: string;
}

const BreadcrumLink = ({ items, page }: BreadcrumLinkProps) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map(({ label, href }, i) => (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumLink;
