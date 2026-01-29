import { ActiveStatus } from '@prisma/client';

export const equipments = [
  {
    title: 'CANON EOS R5',
    mainImage: 'CMM_image/Camera/Eos_r5.webp',
    description:
      'กล้อง Mirrorless Full-frame ความละเอียดสูง 45MP รองรับวิดีโอ 8K RAW และระบบโฟกัสติดตามใบหน้า/ดวงตาที่แม่นยำ เหมาะสำหรับงานภาพนิ่งและวิดีโอระดับมืออาชีพ',
    status: ActiveStatus.active,
    totalStock: 10, // ปรับลดจาก 20 เป็นจำนวนที่เหมาะสมตามคลังภาพ
    subCategoryCode: 'CAM-MIR',
  },
  {
    title: 'CANON EOS R6',
    mainImage: 'CMM_image/Camera/Eos_r6.webp',
    description:
      'กล้อง Mirrorless Full-frame สาย Hybrid ความละเอียด 20MP โดดเด่นด้านการถ่ายในที่แสงน้อยและระบบกันสั่นในตัวเครื่อง (IBIS) ที่ทรงพลัง',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-MIR',
  },
  {
    title: 'CANON EOS R7',
    mainImage: 'CMM_image/Camera/Eos_r6.webp',
    description:
      'กล้อง Mirrorless Full-frame สาย Hybrid ความละเอียด 20MP โดดเด่นด้านการถ่ายในที่แสงน้อยและระบบกันสั่นในตัวเครื่อง (IBIS) ที่ทรงพลัง',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-MIR',
  },
  {
    title: 'CANON EOS R8',
    mainImage: 'CMM_image/Camera/Eos_r6.webp',
    description:
      'กล้อง Mirrorless Full-frame สาย Hybrid ความละเอียด 20MP โดดเด่นด้านการถ่ายในที่แสงน้อยและระบบกันสั่นในตัวเครื่อง (IBIS) ที่ทรงพลัง',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-MIR',
  },
  {
    title: 'CANON EOS R9',
    mainImage: 'CMM_image/Camera/Eos_r6.webp',
    description:
      'กล้อง Mirrorless Full-frame สาย Hybrid ความละเอียด 20MP โดดเด่นด้านการถ่ายในที่แสงน้อยและระบบกันสั่นในตัวเครื่อง (IBIS) ที่ทรงพลัง',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-MIR',
  },
  {
    title: 'CANON EOS 6D',
    mainImage: 'CMM_image/Camera/Eos_6d.webp',
    description:
      'กล้อง Full-frame DSLR ระดับพื้นฐานที่ให้ไฟล์ภาพนุ่มนวลและสกินโทนที่สวยงาม เหมาะสำหรับการถ่ายภาพบุคคล (Portrait) และงานพิธีการทั่วไป',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-DSLR',
  },
  {
    title: 'CANON EOS 80D',
    mainImage: 'CMM_image/Camera/Eos_80d.webp',
    description:
      'กล้อง DSLR เซนเซอร์ขนาด APS-C ที่ใช้งานง่าย มาพร้อมระบบโฟกัส Dual Pixel CMOS AF เหมาะสำหรับการถ่ายวิดีโอ Content Creator และงานกึ่งโปร',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-DSLR',
  },
  {
    title: 'LUMIX S1H',
    mainImage: 'CMM_image/Camera/Lumix_s1n.webp',
    description:
      'กล้อง Full-frame Mirrorless ที่เน้นงานวิดีโอระดับ Cinema รองรับการบันทึก 6K มีพัดลมระบายความร้อนในตัวเพื่อการถ่ายทำที่ยาวนานโดยเครื่องไม่น็อก',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-MIR',
  },
  {
    title: 'GOPRO HERO 9',
    mainImage: 'CMM_image/Camera/Gopro9.webp',
    description:
      'กล้อง Action Camera ความละเอียดวิดีโอ 5K พร้อมหน้าจอสีด้านหน้าสำหรับเช็คเฟรมภาพ และระบบกันสั่น HyperSmooth 3.0 ที่นิ่งเหมือนใช้กิมบอล',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-ACT',
  },
  {
    title: 'GOPRO MAX',
    mainImage: 'CMM_image/Camera/GoproMax.webp',
    description:
      'กล้อง Action แบบ 360 องศา สามารถเลือกมุมกล้องได้ภายหลังหลังจากการถ่ายเสร็จสิ้น พร้อมระบบเสียงรอบทิศทาง 6 ไมโครโฟน',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'CAM-ACT',
  },
  {
    title: 'CANON RF 15-35MM F2.8L IS USM',
    mainImage: 'CMM_image/Lens/Rf 15.webp', // อ้างอิงจากไฟล์ Rf 15.webp
    description:
      'เลนส์ซูมมุมกว้างระยะ Ultra-Wide เกรดโปร (L-series) พร้อมระบบกันสั่นในตัว เหมาะสำหรับถ่ายภาพสถาปัตยกรรมและงานวิดีโอในพื้นที่แคบ',
    status: ActiveStatus.active,
    totalStock: 5,
    subCategoryCode: 'LENS-RF',
  },
  {
    title: 'CANON RF 50MM F1.2L USM',
    mainImage: 'CMM_image/Lens/Rf50.webp', // อ้างอิงจากไฟล์ Rf50.webp
    description:
      'เลนส์ Fixed ระยะมาตรฐานที่มีรูรับแสงกว้างถึง F1.2 ให้โบเก้ที่ละมุนและสวยงาม เหมาะสำหรับการถ่ายภาพบุคคล (Portrait) ระดับมืออาชีพ',
    status: ActiveStatus.active,
    totalStock: 5,
    subCategoryCode: 'LENS-RF',
  },

  // --- LENS-EF (สำหรับ 6D, 80D) ---
  {
    title: 'CANON EF 85MM F1.4L IS USM',
    mainImage: 'CMM_image/Lens/Ef-85.webp', // อ้างอิงจากไฟล์ Ef-85.webp
    description:
      'เลนส์ Portrait ยอดนิยมสำหรับกล้อง DSLR ให้ความคมชัดสูงพร้อมระบบกันสั่น ช่วยให้การถ่ายภาพในที่แสงน้อยทำได้ง่ายขึ้น',
    status: ActiveStatus.active,
    totalStock: 5,
    subCategoryCode: 'LENS-EF',
  },
  {
    title: 'CANON EF 24-70MM F2.8L II USM',
    mainImage: 'CMM_image/Lens/Ef.webp', // อ้างอิงจากไฟล์ Ef.webp
    description:
      'เลนส์ซูมอเนกประสงค์คุณภาพสูงที่ช่างภาพอาชีพต้องมี ครอบคลุมระยะตั้งแต่ Wide จนถึง Portrait ระยะใกล้',
    status: ActiveStatus.active,
    totalStock: 5,
    subCategoryCode: 'LENS-EF',
  },

  // --- LENS-LUMIX-S ---
  {
    title: 'PANASONIC LUMIX S PRO 24-70MM F2.8',
    mainImage: 'CMM_image/Lens/Lumix-s.webp', // อ้างอิงจากไฟล์ Lumix-s.webp
    description:
      'เลนส์ซูมมาตรฐานสำหรับกล้อง Full-frame L-Mount (S1H) ออกแบบมาเพื่อประสิทธิภาพสูงสุดทั้งงานภาพนิ่งและวิดีโอระดับ Cinema',
    status: ActiveStatus.active,
    totalStock: 3,
    subCategoryCode: 'LENS-LUMIX-S',
  },

  {
    title: 'GODOX 180W VIDEO LIGHT',
    mainImage: 'CMM_image/Ligth/Godox%20180w.webp',
    description:
      'ไฟสตูดิโอต่อเนื่องความแรง 180W ให้ค่าสีที่แม่นยำ เหมาะสำหรับการถ่ายวิดีโอสัมภาษณ์หรือจัดแสงในสตูดิโอขนาดกลาง',
    status: ActiveStatus.active,
    totalStock: 4,
    subCategoryCode: 'LIG-PHOTO',
  },
  {
    title: '240W LED VIDEO PANEL',
    mainImage: 'CMM_image/Ligth/240w.webp',
    description:
      'แผงไฟ LED กำลังสูง 240W ให้ความสว่างกระจายตัวได้ดี ปรับอุณหภูมิสีได้ เหมาะสำหรับเติมแสงสว่างให้พื้นที่กว้าง',
    status: ActiveStatus.active,
    totalStock: 2,
    subCategoryCode: 'LIG-STUDIO',
  },
  {
    title: 'GODOX SOFTBOX WITH GRID',
    mainImage: 'CMM_image/Ligth/Godox_softbox.webp',
    description:
      'ซอฟต์บ็อกซ์สำหรับช่วยให้แสงนุ่มนวลขึ้น มาพร้อม Grid เพื่อควบคุมทิศทางของแสงไม่ให้ฟุ้งกระจาย',
    status: ActiveStatus.active,
    totalStock: 6,
    subCategoryCode: 'LIG-STUDIO',
  },

  {
    title: 'RODE Wireless GO II (Blink 500)',
    mainImage: 'CMM_image/Mic/Blink500.webp',
    description:
      'ไมโครโฟนไร้สายขนาดเล็ก เหมาะสำหรับงานวิดีโอและงานสัมภาษณ์ ให้เสียงคมชัด พกพาสะดวก',
    status: ActiveStatus.active,
    totalStock: 5,
    subCategoryCode: 'MIC-WIRELESS',
  },
  {
    title: 'Saramonic Wireless Microphone',
    mainImage: 'CMM_image/Mic/Saramonic.webp',
    description:
      'ไมโครโฟนไร้สายคุณภาพสูง เหมาะสำหรับงานถ่ายทำ วิดีโอคอนเทนต์ และงานไลฟ์',
    status: ActiveStatus.active,
    totalStock: 4,
    subCategoryCode: 'MIC-WIRELESS',
  },
  {
    title: 'Shotgun Microphone',
    mainImage: 'CMM_image/Mic/Shotgun.webp',
    description:
      'ไมโครโฟนแบบ Shotgun สำหรับรับเสียงทิศทางเดียว เหมาะกับงานถ่ายวิดีโอและงานภาพยนตร์',
    status: ActiveStatus.active,
    totalStock: 3,
    subCategoryCode: 'MIC-SHOTGUN',
  },
  {
    title: 'PGYTECH Camera Backpack',
    mainImage: 'CMM_image/Others/BACKPACK_PGYTECH.webp',
    description:
      'กระเป๋ากล้องจาก PGYTECH สำหรับใส่อุปกรณ์ถ่ายภาพและวิดีโอ ช่วยปกป้องอุปกรณ์และพกพาได้สะดวก',
    status: ActiveStatus.active,
    totalStock: 3,
    subCategoryCode: 'OTH-STAND',
  },
  {
    title: 'LP-E6N Battery',
    mainImage: 'CMM_image/Others/LPE6N_BATERY.webp',
    description:
      'แบตเตอรี่กล้อง LP-E6N สำหรับกล้อง DSLR และ Mirrorless ใช้งานได้ยาวนาน เหมาะสำหรับงานถ่ายทำ',
    status: ActiveStatus.active,
    totalStock: 6,
    subCategoryCode: 'OTH-MEM',
  },
  {
    title: 'SD Card 64GB',
    mainImage: 'CMM_image/Others/SD_CARD_64GB.webp',
    description:
      'การ์ดหน่วยความจำ SD Card ความจุ 64GB สำหรับบันทึกภาพถ่ายและวิดีโอ รองรับงานถ่ายทำทั่วไป',
    status: ActiveStatus.active,
    totalStock: 10,
    subCategoryCode: 'OTH-MEM',
  },
  {
    title: 'Photography Starter Set',
    mainImage: 'CMM_image/Set-Bundler/SET_PHOTO_1.webp',
    description:
      'ชุดอุปกรณ์ถ่ายภาพสำหรับผู้เริ่มต้น รวมอุปกรณ์พื้นฐานที่จำเป็นสำหรับการถ่ายภาพและวิดีโอ',
    status: ActiveStatus.active,
    totalStock: 2,
    subCategoryCode: 'BUD-SET',
  },
  {
    title: 'Photography Advanced Set',
    mainImage: 'CMM_image/Set-Bundler/SET_PHOTO_2.webp',
    description:
      'ชุดอุปกรณ์ถ่ายภาพระดับมืออาชีพ เหมาะสำหรับงานถ่ายทำจริงและงานโปรดักชัน',
    status: ActiveStatus.active,
    totalStock: 1,
    subCategoryCode: 'BUD-SET',
  },
  {
    title: 'DJI Ronin RS 3',
    mainImage: 'CMM_image/Tripod/Ronin_rs3.webp',
    description:
      'กิมบอลกันสั่น DJI Ronin RS 3 สำหรับกล้อง Mirrorless และ DSLR ช่วยให้การถ่ายวิดีโอนิ่งและลื่นไหล',
    status: ActiveStatus.active,
    totalStock: 2,
    subCategoryCode: 'TRI-GIMBAL',
  },
  {
    title: 'DJI Ronin RS 4',
    mainImage: 'CMM_image/Tripod/Ronin_rs4.webp',
    description:
      'กิมบอลกันสั่น DJI Ronin RS 4 รุ่นใหม่ ประสิทธิภาพสูง เหมาะสำหรับงานถ่ายทำระดับมืออาชีพ',
    status: ActiveStatus.active,
    totalStock: 1,
    subCategoryCode: 'TRI-GIMBAL',
  },
];
