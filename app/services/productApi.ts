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
