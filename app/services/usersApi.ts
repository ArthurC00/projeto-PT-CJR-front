import { api } from "../services/api";

export const getOneUser = async (userId: number) => {
  try {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};
