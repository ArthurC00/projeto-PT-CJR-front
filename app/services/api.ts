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
}


export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria_id: number;
  categoria: {
  select: {
    id: number,
    nome: string,
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
}

export interface CategoriaDetalhe {
  id: number;
  nome: string;
  categoria_pai_id: number | null;
  tipos: {
    id: number;
    nome: string;
  }[];
  todosOsProdutos: {
    id: number;
    nome: string;
    preco: number;
    categoria_id?: number;
    imagens: {
      url_imagem: string;
      ordem: number;
    }[];
  }[];
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

export const getCategoriaComProdutos = async (id: string): Promise<CategoriaDetalhe> => {
  try {
    const response = await axios.get(`http://127.0.0.1:3001/categorias/${id}/produtos`)
    return response.data
  } catch (error: any) {
    console.log('erro:', error.response?.data)
    throw new Error(error.message)
  }
}