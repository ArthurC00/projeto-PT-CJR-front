import { jwtDecode } from "jwt-decode";

export function decodeUserToken(token: string | null): UserDataProps | null {
  if (!token) return null;

  try {
    return jwtDecode<UserDataProps>(token);
  } catch (error) {
    console.error("Erro ao decodificar o JWT:", error);
    return null;
  }
}
