// coisas da integração
"use client";
import { useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// coisas da própria tela de login
import Link from "next/link";
import Image from "next/image";
import { postLogin } from "../services/api";
import { decodeUserToken } from "../utils/auth";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const urlComplete = query ? `${pathname}?${query}` : pathname;
  const returnTo = encodeURIComponent(urlComplete);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await postLogin({ email: email, senha_hash: password });

      if (token) {
        localStorage.setItem("token", token);
        const userData = decodeUserToken(token);

        if (userData) {
          const returnTo = searchParams.get("returnTo");
          if (returnTo) {
            router.push(returnTo);
          } else {
            router.push(`/feed`);
          }
        }
      }
    } catch (error: any) {
      alert(
        "Erro ao logar: " +
          (error.response?.data?.message || "servidor offline"),
      );
    }
  };

  return (
    <main className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full overflow-hidden">
      <div className="w-full px-10 md:w-1/2 flex flex-col items-center justify-center py-8 md:py-0 md:h-screen">
        <Image
          className="w-full md:w-auto md:h-1/4 mb-4 md:mb-0"
          src="/images/logo_stock.io.png"
          width={421}
          height={222}
          alt="Logo Stock.io"
        />
        <Image
          className="hidden md:block h-3/4 w-[512px] self-center"
          src="/images/stockles_caixa.png"
          width={514}
          height={802}
          alt="Mascote Stockles segurando uma caixa."
        />
      </div>

      <div className="w-[90%] md:w-1/2 md:max-w-xl bg-[#171918] flex flex-col items-center justify-center md:pt-0 pt-12 pb-16 md:pb-0 px-4 rounded-t-4xl md:rounded-t-4xl md:mr-8 lg:mr-16 md:h-[85vh] shadow-2xl mt-auto md:mt-0 md:self-end">
        <h1 className="text-white font-black text-3xl md:text-4xl m-6 text-center">
          BEM VINDO DE VOLTA!
        </h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-full max-w-sm text-white"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email"
            aria-label="E-mail"
            className="bg-[#FFFFFF] text-black rounded-full my-3 h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
          />

          <div className="relative w-full">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="senha"
              placeholder="Senha"
              aria-label="Senha"
              className="bg-[#FFFFFF] text-black rounded-full my-3 h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <p className="my-4 font-thin text-sm md:text-md text-right">
            <Link
              href="/recuperar-conta"
              className="underline hover:text-gray-300 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </p>

          <button
            type="submit"
            className="bg-[#6A38F3] hover:bg-[#5b2cd6] transition-colors text-white font-bold rounded-full mt-2 mb-6 h-12 w-full"
          >
            ENTRAR
          </button>

          <p className="text-center md:text-start text-sm md:text-lg font-extralight">
            Não possui uma conta?{" "}
            <Link
              href="/cadastro"
              className="text-[#6A38F3] font-medium hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
