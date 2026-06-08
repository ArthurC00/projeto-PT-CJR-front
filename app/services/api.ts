import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

interface Login {
  email: string;
  senha_hash: string;
}

interface Cadastro {
  nome: string;
  username: string;
  email: string;
  senha_hash: string;
  foto_perfil_url: string;
}

interface produtos {
  id: number;
  nome: string;
  preço: number;
  categoria: categorias
}

interface categorias {
  id: number;
  nome: string;
  slug: string;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria_id: number;
  categoria: {
  select: {
    id: true,
    nome: true,
      }
    },
  imagens: {
    url_imagem: string;
    ordem: number;
  }[];
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}


export const postLogin = async (body: Login) => {
  try {
    const response = await api.post(`/login`, body);
    return response.data.token;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const postCadastro = async (body: Cadastro) => {
  try {
    const response = await api.post(`/usuarios`, body);
    return response.data;
  } catch (e: any) {
    throw new Error(e.message);
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
    const response = await api.get('/produto');
    return response.data;
  } catch ( e: any ) {
    throw new Error(e.message);
  }
}

export const getCategorias = async () => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch ( e: any ) {
    throw new Error(e.message);
  }
}

export const getCategoriasRaiz = async () => {
  try {
    const response = await api.get('/categorias/raiz');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}