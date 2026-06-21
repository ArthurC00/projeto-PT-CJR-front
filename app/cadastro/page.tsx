"use client";
import React, { useState } from "react";
import Image from "next/image";
import { postCadastro } from "../services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"



export default function RegisterPage() {

  const router = useRouter()
  const [sucesso, setSucesso] = useState("")
  const [erro, setErro] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    username: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso("");
    setErro("");

    if (formData.senha !== formData.confirmarSenha) {
      setErro("as senhas não coincidem!")
      return
    }

    try {
        await postCadastro({
        nome: formData.nomeCompleto,
        username: formData.username,
        email: formData.email,
        senha_hash: formData.senha,
        foto_perfil_url: "",
      });

      setSucesso("cadastrado com sucesso!")

      setFormData({
        nomeCompleto: "",
        username: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      });

      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      const mensagemErro = error?.response?.data?.message || "Não foi possível cadastrar."
      setErro(Array.isArray(mensagemErro) ? mensagemErro.join(", ") : mensagemErro)
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-10 md:px-20 pt-10 pb-0 w-full gap-20 md:gap-30">
      {/* LADO ESQUERDO - FORMULÁRIO */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-start h-screen">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md mt-10 flex-1 bg-black/95 rounded-t-[40px] rounded-b-none p-10 flex flex-col items-center shadow-2xl"
        >
          <h1 className="text-white text-2xl font-bold mb-10 tracking-widest text-center">
            CRIE SUA CONTA
          </h1>

          <div className="w-full flex flex-col gap-4">
            <input
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              placeholder="Nome Completo"
              required
              className="bg-[#FFFFFF] text-black rounded-full h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
            />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="bg-[#FFFFFF] text-black rounded-full h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="bg-[#FFFFFF] text-black rounded-full h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
            />
            <div className="relative w-full">
              <input
                required 
                type ={mostrarSenha ? "text" : "password"}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Senha"
                className="bg-[#FFFFFF] text-black rounded-full h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
              />
              <button
              type="button"
              onClick={() => setMostrarSenha((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {mostrarSenha ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>
            
            <div className="relative w-full">
              <input
                name="confirmarSenha"
                type= {mostrarConfirmarSenha ? "text" : "password"}
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirmar Senha"
                required
                className="bg-[#FFFFFF] text-black rounded-full h-12 w-full pl-8 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]"
              />
              <button
              type="button"
              onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {mostrarConfirmarSenha ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>
          </div>

          {/* mensagem de sucesso */}
          {sucesso && (
            <p className="w-full mt-4 text-green-400 text-sm text-center">
              ✓ {sucesso} Redirecionando para o login...
            </p>
          )}

          {/* mensagem de erro */}
          {erro && (
            <p className="w-full mt-4 text-red-400 text-sm text-center">
              ✗ {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-10 bg-[#7645D9] text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition-all text-sm tracking-wide"
          >
            CADASTRAR
          </button>

          <p className="text-start md:text-start text-white md:text-lg pt-2 font-extralight">
            Já possui uma conta?{" "}
            <Link
              className="text-[#6A38F3] font-medium hover:underline"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* LADO DIREITO - ILUSTRAÇÃO */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center relative h-[300px] md:h-[600px]">
        <div className="relative w-full h-full max-w-md">
          <div className="absolute -top-30 left-[35%] -translate-x-1/2 z-10 w-60 h-32">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <Image
            src="/foto.png"
            alt="Ilustração"
            fill
            style={{ objectFit: "contain", objectPosition: "left" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
