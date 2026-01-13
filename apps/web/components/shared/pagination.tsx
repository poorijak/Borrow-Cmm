import React from "react";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ButtonGroup } from "../ui/button-group";

interface PaginationProps {
  page: number;
  total?: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({
  page,
  total,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="w-full flex items-center justify-between px-0 md:px-5">
      <div className="hidden md:flex">
        <span className="text-muted-foreground  ">
          พบทั้งหมด <span className="text-primary">{total}</span> รายการ
        </span>
      </div>

      <p className="text-muted-foreground">
        <span className="text-primary">{page}</span> จาก{" "}
        <span className="text-primary">{totalPages}</span>
      </p>
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              disabled={page <= 1}
              onClick={() => onPageChange(1)}
              className="hidden md:flex"
            >
              <ChevronsLeft />
            </Button>
            <ButtonGroup>
              <Button
                size="icon"
                variant="outline"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeft />
              </Button>

              <Button
                size="icon"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronRight />
              </Button>
            </ButtonGroup>
            <Button
              size="icon"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => onPageChange(totalPages)}
              className="hidden md:flex"
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
