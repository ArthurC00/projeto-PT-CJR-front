import { user } from "./lojaTypes";

export interface ProductImage {
  id: number;
  url_imagem: string;
  ordem: number;
}

export interface ProductCategoria {
  id: number;
  nome: string;
}

export interface ProductLoja {
  id: number;
  nome: string;  
  usuario_id: number;
  banner_url: string;
}

export interface ProductResponse {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  descricao: string;
  loja_id: number;
  categoria_id: number;
  avaliacoes: ReviewProduct[];
  loja: ProductLoja;
  categoria: ProductCategoria;
  imagens: ProductImage[];
}

export interface ReviewProduct {
  id: number;
  usuario_id: number;
  produto_id: number;
  nota: number;
  comentario: string;
  createdAt: string;
  usuario: user;
}
