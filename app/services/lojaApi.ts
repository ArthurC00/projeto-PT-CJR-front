import { LojaDetalhesResponse, LojaUsuarioResponse } from "../types/lojaTypes";
import { api } from "./api";

export const getReviewByLojaId = async (id: number): Promise<any> => {
  try {
    const response = await api.get<any>(`/avaliacoes-loja/loja/${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const getLojasById = async (
  id: number,
): Promise<LojaUsuarioResponse[]> => {
  try {
    const response = await api.get(`/lojas?usuario_id=${id}`);
    return response.data;
  } catch (e: any) {
    throw new Error(e);
  }
};
