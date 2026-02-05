import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface CardSwiperProps {
  children: React.ReactNode;
}

const SwiperWrapper = ({ children }: CardSwiperProps) => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        style={
          {
            "--swiper-navigation-size": "20px",
            "--swiper-theme-color": "#000",
          } as React.CSSProperties
        }
        spaceBetween={10} 
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 10 }, // ลองใส่ .2 เพื่อให้เห็น slide ถัดไปล้ำเข้ามา จะได้เช็ค gap ง่ายขึ้น
          640: { slidesPerView: 2.5, spaceBetween: 15 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
        navigation
        pagination={{ clickable: true }}
        className="mySwiper !pb-12" // เพิ่ม padding bottom ให้ชัดเจน
      >
        {React.Children.map(children, (child) => (
          <SwiperSlide className="flex justify-center">
            {/* หุ้ม div อีกชั้นเพื่อคุมขนาด card ไม่ให้เบียดกันเอง */}
            <div className="h-full w-full">{child}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperWrapper;
