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

export interface ProdutoListagem {
  id: number;
  nome: string;
  preco: string | number;
  estoque: number;
  descricao: string;
  loja_id: number;
  categoria_id: number;
  loja: {
    banner_url: string | null;
  };
  categoria: {
    id: number;
    nome: string;
  };
  imagens: {
    url_imagem: string;
    ordem: number;
  }[];
}

export const getProductById = async (
  id: number,
): Promise<ProdutoListagem[]> => {
  try {
    const reponse = await api.get(`produto/usuario/${id}`);
    return reponse.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
};
