import dayjs from 'dayjs';
import 'dayjs/locale/th'; 

export const formatDateToDDMMYY = (date: Date | undefined | null) => {
  if (!date) {
    return 'No due date';
  }
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss').split('-', 3).join(' ');
};

export const formatDateToYYYYMMDD = (date: Date | undefined | null) => {
  if (!date) {
    return 'No due date';
  }
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatDateThaiFull = (date: Date | string | undefined | null) => {
  if (!date) return 'ไม่มีข้อมูลวันที่';

  return dayjs(date).locale('th').format('D MMMM YYYY');
};
