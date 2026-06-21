import { api } from "../services/api";

export const getOneUser = async (userId: number) => {
  try {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.reponse?.data?.message || e.message,
    };
  }
};
