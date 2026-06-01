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
