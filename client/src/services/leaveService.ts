import api from './api';

export const applyLeave = async (leaveData: {
  leaveType: 'casual' | 'sick' | 'paid';
  startDate: string; 
  endDate: string;   
  reason: string;
}) => {
  const response = await api.post('/leave/apply', leaveData);
  return response.data;
};

export const getMyLeaves = async () => {
  const response = await api.get('/leave/my-leaves');
  return response.data;
};

export const editLeave = async (id: string, leaveData: any) => {
  const response = await api.put(`/leave/${id}`, leaveData);
  return response.data;
};

export const cancelLeave = async (id: string) => {
  const response = await api.delete(`/leave/${id}`);
  return response.data;
};


export const getAllLeavesByAdmin = async () => {
  
  
  
  
  
  
  const response = await api.get('/admin/users'); 
  return response.data;
};

export const approveLeave = async (id: string) => {
  const response = await api.put(`/admin/leave/${id}/approve`);
  return response.data;
};

export const rejectLeave = async (id: string) => {
  const response = await api.put(`/admin/leave/${id}/reject`);
  return response.data;
};
