import api from './api';

export const markAttendance = async (attendanceData: { date: string, status: string }) => {
  const response = await api.post('/attendance/mark', attendanceData);
  return response.data;
};

export const getMyAttendance = async () => {
  const response = await api.get('/attendance/my-attendance');
  return response.data;
};

export const getSystemAttendance = async () => {
  const response = await api.get('/admin/attendance');
  return response.data;
};
