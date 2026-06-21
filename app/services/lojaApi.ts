import {
  LojaDetalhesResponse,
  LojaReviewRequest,
  LojaReviewResponse,
  LojaUsuarioResponse,
  ReviewCommentRequest,
} from "../types/lojaTypes";
import { api } from "./api";

export const getReviewByLojaId = async (
  id: number,
): Promise<LojaReviewResponse[]> => {
  try {
    const response = await api.get(`/avaliacoes-loja/loja/${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const getLojasByUserId = async (
  id: number,
): Promise<LojaUsuarioResponse[]> => {
  try {
    const response = await api.get(`/lojas?usuario_id=${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const getLojaByLojaId = async (
  id: number,
): Promise<LojaDetalhesResponse> => {
  try {
    const response = await api.get(`/lojas/${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const postAddLojaReview = async (
  body: LojaReviewRequest,
): Promise<void> => {
  try {
    await api.post<LojaReviewResponse>(`/avaliacoes-loja`, body);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const getReviewById = async (
  id: number,
): Promise<LojaReviewResponse> => {
  try {
    const response = await api.get(`/avaliacoes-loja/${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const updateReviewById = async (
  id: number,
  body: Pick<LojaReviewRequest, "nota" | "comentario">,
): Promise<void> => {
  try {
    await api.patch(`/avaliacoes-loja/${id}`, body);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const deleteReviewById = async (id: number): Promise<void> => {
  try {
    await api.delete(`/avaliacoes-loja/${id}`);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const getReviewCommentByReviewId = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/comentarios-avaliacao/all/${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const postReviewCommentByReviewId = async (
  body: ReviewCommentRequest,
): Promise<void> => {
  try {
    await api.post(`/comentarios-avaliacao/`, body);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const updateReviewCommentById = async (
  id: number,
  body: Pick<ReviewCommentRequest, "conteudo">,
): Promise<void> => {
  try {
    await api.patch(`/comentarios-avaliacao/${id}`, body);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const deleteReviewCommentById = async (id: number): Promise<void> => {
  try {
    await api.delete(`/comentarios-avaliacao/${id}`);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const getAllLojas = async (): Promise<LojaUsuarioResponse[]> => {
  try {
    const response = await api.get(`/lojas`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};
