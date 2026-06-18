export interface LojaDetalhesResponse {
  id: number;
  nome: string;
  descricao: string;
  logo_url: string | null;
  banner_url: string | null;
  usuario: user;
}

export interface LojaUsuarioResponse {
  id: number;
  nome: string;
  descricao: string;
  logo_url: string | null;
  banner_url: string | null;
}

export interface LojaReviewRequest {
  usuario_id: number;
  loja_id: number;
  nota: number;
  comentario: string;
}

export interface LojaReviewResponse {
  id: number;
  usuario_id: number;
  loja_id: number;
  nota: number;
  comentario: string;
  createdAt: string;
  updatedAt: string;
  loja: ReviewLoja;
  usuario: user;
}

export interface ReviewLoja {
  id: number;
  nome: string;
  logo_url: string | null;
  banner_url: string | null;
}

export interface user {
  id: number;
  nome: string;
  foto_perfil_url: string | null;
}

export interface ReviewCommentRequest {
  conteudo: string;
  usuario_id: number;
  avaliacao_loja_id: number | null;
  avaliacao_produto_id: number | null;
}

export interface ReviewCommentResponse {
  id: number;
  conteudo: string;
  usuario_id: number;
  usuario: user;
}
