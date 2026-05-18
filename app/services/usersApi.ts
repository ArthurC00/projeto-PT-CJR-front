import { api } from "../services/api";

export const getOneUser = async (userId: number, token: string) => {
  try {
    const response = await api.get(`/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};
