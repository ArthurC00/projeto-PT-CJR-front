import axios from "axios";

export const  api = axios.create({
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

export interface EditarUsuario {
  nome: string;
  username: string;
  email: string;
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

export const editUser = async (userId: number, body: EditarUsuario) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.patch(`/usuarios/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert("Alterações salvas")
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
}

export const updatePassword = async (id: number, {oldPassword, newPassword}: any) => {
  // parei aqui pq não sabia se isso ainda era da minha task ou se era da integração do perfil
}

export const deleteUser = async (userId: number) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert("Conta deletada.")
    return response.data;
    
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
}