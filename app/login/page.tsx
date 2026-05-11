// coisas da integração
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// coisas da própria tela de login
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState(""); // integração
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    // também é da integração
    e.preventDefault(); // impede que a página recarregue quando clicar em "entrar"

    // console.log(email, password);

    try {
      // tentar conectar ao back-end
      const response = await axios.post("http://localhost:3001/login", {
        // dados a serem recebidos
        email: email,
        senha_hash: password, // senha_hash foi o que usaram no back-end
      });

      //console.log("login bem-sucedido", response.data);
      alert("Logado com sucesso");
      //router.push("/dashboard"); // redirecionar o usuário para a página principal ao logar
    } catch (error: any) {
      // se houver erro no back-end
      console.error("erro no login:", error.response?.data);
      alert(
        "Erro ao logar: " +
          (error.response?.data?.message || "servidor offline"),
      );
    }
  };

  // a partir desse ponto é a própria tela de login
  return (
    <main className="bg-[#F6F3E4] flex flex-row items-center justify-center justify-items-center h-screen w-screen">
      <div className="h-screen w-[50vw] justify-items-center">
        <Image
          className="w-auto h-1/4 self-center"
          src="/images/logo_stock.io.png"
          width={421}
          height={222}
          alt="Logo Stock.io"
        />
        <Image
          className="h-3/4 w-auto self-end"
          src="/images/stockles_caixa.png"
          width={514}
          height={802}
          alt="Mascote Stockles segurando uma caixa."
        />
      </div>
      <div className="h-[85vh] w-[50vw] bg-[#171918] mr-16 pt-12 rounded-t-4xl text-center justify-self-start justify-center place-items-center font-sans self-end">
        <h1 className="font-black text-4xl m-6 tracking-wide">
          BEM VINDO DE VOLTA!
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col w-5/6">
          <input
            required
            type="email"
            value={email} // integração com React
            onChange={(e) => setEmail(e.target.value)} // integração com React
            name="email"
            placeholder="Email"
            aria-label="E-mail"
            className="bg-[#FFFFFF] text-black rounded-full my-3 h-10 w-full pl-8"
          />
          <input
            required
            type="password"
            value={password} // integração com React
            onChange={(e) => setPassword(e.target.value)} // integração com React
            name="senha"
            placeholder="Senha"
            aria-label="Senha"
            className="bg-[#FFFFFF] text-black rounded-full my-3 h-10 w-full pl-8"
          />
          <p className="m-4 font-thin text-md">
            <Link href="/recuperar-conta" className="underline">
              Esqueceu sua senha?
            </Link>
          </p>
          <button
            type="submit"
            className="bg-[#6A38F3] font-bold rounded-full m-2 h-11"
          >
            ENTRAR
          </button>
          <p className="text-start m-4 text-lg font-extralight">
            Não possui uma conta?{" "}
            <Link href="/cadastro" className="text-[#6A38F3] font-medium">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
