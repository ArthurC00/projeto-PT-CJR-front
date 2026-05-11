"use client";
import React, { useState } from "react";
import Image from "next/image";
import api from "../services/api";
import Link from "next/link";

export default function RegisterPage() {
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

    try {
      const response = await api.post("/usuarios", {
        nome: formData.nomeCompleto, // O Back quer 'nome'
        username: formData.username,
        email: formData.email,
        senha_hash: formData.senha, // O Back quer 'senha_hash'
        foto_perfil_url: "", // O Back quer que seja uma string
      });

      console.log("Sucesso:", response.data);
      alert("Usuário cadastrado com sucesso!");

      // Limpar o formulário após o sucesso (opcional)
      setFormData({
        nomeCompleto: "",
        username: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      });
    } catch (error: any) {
      const mensagemErro = error.response?.data?.message || "Erro desconhecido";
      console.error("Detalhes do erro:", mensagemErro);
      alert("Erro ao cadastrar: " + mensagemErro);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-amber-50 px-10 md:px-20 pt-10 pb-0 w-full gap-20 md:gap-30">
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
              className="w-full py-3 px-6 rounded-full bg-[#F5F1DA] text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full py-3 px-6 rounded-full bg-[#F5F1DA] text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full py-3 px-6 rounded-full bg-[#F5F1DA] text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              required
              className="w-full py-3 px-6 rounded-full bg-[#F5F1DA] text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="confirmarSenha"
              type="password"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Confirmar Senha"
              required
              className="w-full py-3 px-6 rounded-full bg-[#F5F1DA] text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-10 bg-[#7645D9] text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition-all text-sm tracking-wide"
          >
            CADASTRAR
          </button>

          <p className="w-full text-gray-400 mt-5 text-sm text-left">
            Já possui uma conta?{" "}
            <Link
              className="text-indigo-400 cursor-pointer hover:underline"
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
