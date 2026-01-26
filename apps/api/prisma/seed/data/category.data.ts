import { ActiveStatus } from '@prisma/client';

export const mainCategory = [
  {
    code: 'CAMERA',
    title: 'กล้องถ่ายภาพ',
    mainImage: 'CMM_image/Category/cate_camera.webp',
    status: ActiveStatus.active,
  },
  {
    code: 'LENS',
    title: 'เลนส์',
    mainImage: 'CMM_image/Category/cate_lens.webp',
    status: ActiveStatus.active,
  },
  {
    code: 'LIGHT',
    title: 'อุปกรณ์แสง',
    mainImage: 'CMM_image/Category/cate_light.webp',
    status: ActiveStatus.active,
  },
  {
    code: 'MIC',
    title: 'ไมโครโฟน',
    mainImage: 'CMM_image/Category/cate_mic.webp',
    status: ActiveStatus.active,
  },
  {
    code: 'TRIPOD',
    title: 'ขาตั้งกล้อง',
    mainImage: 'CMM_image/Category/cate_tripod.webp',
    status: ActiveStatus.active,
  },
  {
    code: 'SET',
    title: 'ชุดอุปกรณ์',
    mainImage: 'CMM_image/Category/set_bundler.webp',
    status: ActiveStatus.active,
  },
  {
    code: 'OTHERS',
    title: 'อุปกรณ์อื่น ๆ',
    mainImage: 'CMM_image/Category/cate_orthers.webp',
    status: ActiveStatus.active,
  },
] as const;

export const subCategories = [
  {
    code: 'CAM-MIR',
    title: 'Mirrorless',
    parentCode: 'CAMERA',
    status: ActiveStatus.active,
  },
  {
    code: 'CAM-DSLR',
    title: 'DSLR',
    parentCode: 'CAMERA',
    status: ActiveStatus.active,
  },
  {
    code: 'CAM-ACT',
    title: 'Action Camera',
    parentCode: 'CAMERA',
    status: ActiveStatus.active,
  },
  {
    code: 'CAM-DRONE',
    title: 'Drone',
    parentCode: 'CAMERA',
    status: ActiveStatus.active,
  },

  // --- LENS ---
  {
    code: 'LENS-RF',
    title: 'Lens RF (สำหรับ R5, R6)',
    parentCode: 'LENS',
    status: ActiveStatus.active,
  },
  {
    code: 'LENS-EF',
    title: 'Lens EF (สำหรับ 6D, 80D)',
    parentCode: 'LENS',
    status: ActiveStatus.active,
  },
  {
    code: 'LENS-LUMIX-S',
    title: 'Lens Lumix S (สำหรับรุ่น S)',
    parentCode: 'LENS',
    status: ActiveStatus.active,
  },
  {
    code: 'LENS-LUMIX-G',
    title: 'Lens Lumix G (สำหรับรุ่น G)',
    parentCode: 'LENS',
    status: ActiveStatus.active,
  },
  {
    code: 'LIG-PHOTO',
    title: 'ไฟถ่ายภาพ',
    parentCode: 'LIGHT',
    status: ActiveStatus.active,
  },
  {
    code: 'LIG-STUDIO',
    title: 'ไฟสตูดิโอ',
    parentCode: 'LIGHT',
    status: ActiveStatus.active,
  },

  // --- MIC ---
  {
    code: 'MIC-WIRELESS',
    title: 'ไมค์ไร้สาย',
    parentCode: 'MIC',
    status: ActiveStatus.active,
  },
  {
    code: 'MIC-SHOTGUN',
    title: 'ไมค์ช็อตกัน',
    parentCode: 'MIC',
    status: ActiveStatus.active,
  },

  // --- TRIPOD ---
  {
    code: 'TRI-GIMBAL',
    title: 'อุปกรณ์กันสั่น',
    parentCode: 'TRIPOD',
    status: ActiveStatus.active,
  },
  {
    code: 'TRI-ACC',
    title: 'ไฟและอุปกรณ์เสริมตัวกล้อง',
    parentCode: 'TRIPOD',
    status: ActiveStatus.active,
  },

  // --- OTHERS ---
  {
    code: 'OTH-STAND',
    title: 'ขาตั้งและอุปกรณ์ประคอง',
    parentCode: 'OTHERS',
    status: ActiveStatus.active,
  }, // ย้ายมาที่นี่
  {
    code: 'OTH-MEM',
    title: 'อุปกรณ์เสริมกล้องและหน่วยความจำ',
    parentCode: 'OTHERS',
    status: ActiveStatus.active,
  },
  {
    code: 'OTH-LIVE',
    title: 'อุปกรณ์เพื่องานถ่ายทอดสด',
    parentCode: 'OTHERS',
    status: ActiveStatus.active,
  },
  {
    code: 'OTH-VR',
    title: 'VR',
    parentCode: 'OTHERS',
    status: ActiveStatus.active,
  },
  {
    code: 'BUD-SET',
    title: 'เซ็ตอุปกรณ์',
    parentCode: 'SET',
    status: ActiveStatus.active,
  },
] as const;
