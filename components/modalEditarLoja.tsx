"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/modal"
import { api } from "@/app/services/api"

type Categoria = {
    id: string
    nome: string
}

type Loja = {
    id: Number
    nome: string
    descricao: string
    logo_url?: string
    banner_url?: string
    sticker_url?: string
    categoria_id?: number
}

type Props = {
    loja: Loja
    onSuccess?: () => void
}

export function ModalEditarLoja({loja, onSuccess}: Props) {
    const [estaAberto, setEstaAberto] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState("")
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const [form, setForm] = useState({
        nome: loja.nome,
        descricao: loja.descricao,
        logo_url: loja.logo_url,
        banner_url: loja.banner_url,
        sticker_url: loja.sticker_url,
        categoria_id: loja.categoria_id?.toString() ?? "",
    })

    useEffect(() => {
        if (!estaAberto) return

        async function buscarCategorias() {
            try {
                const response = await api.get("/categorias/raiz")
                console.log("categorias:", response.data)
                setCategorias(response.data)
            } catch {
                console.log("erro ao buscar categorias")
            }
        }
        buscarCategorias()
    }, [estaAberto])

    function atualizarCampo(campo: string, valor: string) {
        setForm((prev) => ({...prev, [campo]: valor}))
    }

    async function salvar() {
        setCarregando(true)
        setErro("")

        try {
            const token = localStorage.getItem("token")

            await api.patch(`lojas/${loja.id}`, {
                nome: form.nome,
            descricao: form.descricao,
            logo_url: form.logo_url || null,
            banner_url: form.banner_url || null,
            sticker_url: form.sticker_url || null,
            categoria_id: form.categoria_id
                ? Number(form.categoria_id)
                : null,
            }, {
                headers: {Authorization: `Bearer ${token}`} 
            })

            setEstaAberto(false)
            onSuccess?.()
        } catch (e: any) {
            setErro(
                e.response?.data?.message ?? "erro ao atualizar loja"
            )
        } finally {
            setCarregando(false)
        }
    }

    return (
        <>
        <button
        onClick={() => setEstaAberto(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-purple-700 transition-colors">
        Editar Loja
        </button>

        {estaAberto && (
            <Modal
                onClose={() => setEstaAberto(false)}
                height="85vh"
                width="40vw"
            >
                <div className="flex flex-col gap-4 w-full">
                    <h2 className="text-2xl font-semibold text-center mb-2"> Editar loja </h2>
                    <input
                        placeholder="nome da loja"
                        value={form.nome}
                        onChange={(e) => atualizarCampo("nome", e.target.value)}
                        className="bg-white rounded-full px-4 py-2 text-gray-500 focus:outline-none focus:ring-2"
                    />
                    
                    <input 
                        placeholder="descrição da loja"
                        value={form.descricao}
                        onChange={(e) => atualizarCampo("descricao", e.target.value)} 
                        className="bg-white rounded-full px-4 py-2 text-gray-500 focus:outline-none focus:ring-2"
                    />
                    
                    <select
                        value={form.categoria_id}
                        onChange={(e) => atualizarCampo("categoria_id", e.target.value)}
                        className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full bg-white text-gray-500">
                        <option value="">Categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={String(cat.id)}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>
                     
                     <div className="border-2 border-dashed border-purple-400 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">URL da foto de perfil</p>
                            <input
                                placeholder="https://..."
                                value={form.logo_url}
                                onChange={(e) => atualizarCampo("logo_url", e.target.value)}
                                className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full bg-white text-sm"
                                />
                            {form.logo_url && (
                                <img
                                    src={form.logo_url}
                                    alt="preview logo"
                                    className="w-16 h-16 object-cover rounded-full mt-2"
                                    />
                                )}
                    </div>

                    <div className="border-2 border-dashed border-purple-400 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">URL da logo em SVG</p>
                            <input
                                placeholder="https://..."
                                value={form.sticker_url}
                                onChange={(e) => atualizarCampo("sticker_url", e.target.value)}
                                className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full bg-white text-sm"
                                />
                            {form.sticker_url && (
                                <img
                                    src={form.sticker_url}
                                    alt="preview sticker"
                                    className="w-16 h-16 object-cover rounded mt-2"
                                    />
                                )}
                    </div>

                    <div className="border-2 border-dashed border-purple-400 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">URL do banner</p>
                        <input
                            placeholder="https://..."
                            value={form.banner_url}
                            onChange={(e) => atualizarCampo("banner_url", e.target.value)}
                            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full bg-white text-sm"
                            />
                        {form.banner_url && (
                            <img
                                src={form.banner_url}
                                alt="preview banner"
                                className="w-full h-20 object-cover rounded mt-2"
                            />
                        )}
                    </div>

                {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

                <div className="flex gap-3">
                        <button
                            onClick={() => setEstaAberto(false)}
                            className="flex-1 px-4 py-3 border rounded-full hover:bg-gray-50 transition-colors"
                            >
                            Cancelar
                        </button>
                        <button
                            onClick={salvar}
                            disabled={carregando || !form.nome}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
                            >
                            {carregando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </div>
            </Modal>
        )}
        </>
    )
} 