import { ProductResponse } from "../types/productTypes";
import { api } from "./api";

export const PostCreateProduct = async (body: any) => {
  try {
    const response = await api.post(`/produto`, body);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const PatchEditProduct = async (id: number, body: any) => {
  try {
    const response = await api.patch(`/produto/${id}`, body);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const DeleteProduct = async (id: number) => {
  try {
    const response = await api.delete(`/produto/${id}`);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const getProductByUserId = async (
  id: number,
): Promise<ProductResponse[]> => {
  try {
    const reponse = await api.get(`produto/usuario/${id}`);
    return reponse.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const getProductByLojaId = async (
  id: number,
): Promise<ProductResponse[]> => {
  try {
    const reponse = await api.get(`produto/loja/${id}`);
    return reponse.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const getOneProduct = async (id: string) => {
  try {
    const response = await api.get(`/produto/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProdutos = async () => {
  try {
    const response = await api.get("/produto");
    return response.data;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const getProductsReviewByProductId = async (id: string) => {
  try {
    const response = await api.get(`/avaliacoes-produto/product/${id}`);
    return response.data;
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const postProductReview = async (body: {
  usuario_id: number;
  produto_id: number;
  nota: number;
  comentario: string;
}) => {
  try {
    const response = await api.post(`/avaliacoes-produto`, body);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const updateProductReview = async (
  id: number,
  body: { nota: number; comentario: string },
): Promise<void> => {
  try {
    await api.patch(`/avaliacoes-produto/${id}`, body);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

export const deleteProductReview = async (id: number): Promise<void> => {
  try {
    await api.delete(`/avaliacoes-produto/${id}`);
  } catch (e: any) {
    throw {
      status: e.response?.status,
      message: e.response?.data?.message || e.message,
    };
  }
};

