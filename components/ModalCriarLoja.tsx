"use client"

import { api } from "@/app/services/api"
import Modal from "@/components/modal"
import { useState, useEffect } from "react"

type Categoria = {
    id: number
    nome: string
}

type Props = {
    usuario_id: number
    onSuccess?: () => void
}

export function ModalCriarLoja({usuario_id, onSuccess}: Props) {
    const [estaAberto, setEstaAberto] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState("")
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const [form, setForm] = useState({
        nome:"",
        descricao:"",
        logo_url:"",
        sticker_url:"",
        banner_url:"",
        categoria_id:"",
    })

    useEffect(() =>{
        if(!estaAberto) return

        async function buscarCategorias() {
            try {
                const response = await api.get("/categorias/raiz")
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
            const token = (localStorage.getItem("token"))
            await api.post("/lojas", {
                nome: form.nome,
                descricao: form.descricao,
                logo_url: form.logo_url || null,
                banner_url: form.banner_url || null,
                sticker_url: form.sticker_url || null,
                categoria_id: form.categoria_id 
                    ? Number(form.categoria_id)
                    : null,
                usuario_id: usuario_id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setForm({
                nome:"",
                descricao:"",
                logo_url:"",
                sticker_url:"",
                banner_url:"",
                categoria_id:"",
            })

            setEstaAberto(false)
            onSuccess?.()
        } catch (e: any) {
            setErro(
                e.response?.data?.message ?? "erro ao criar loja."
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
        Adicionar loja
        </button>

        {estaAberto && (
            <Modal
            onClose={() => setEstaAberto(false)}
            height="85vh"
            width="40vw"
            >
                <div className="flex flex-col gap-4 w-full">
                    <h1 className="text-gray-700 text-3xl text-center"> Adicionar uma loja </h1>
                    <input 
                        placeholder="nome da loja"
                        value={form.nome}
                        onChange={(e) => atualizarCampo("nome", e.target.value)} 
                        className="bg-white rounded-full px-4 py-2 text-gray-500 focus:outline-none focus:ring-2"
                    />
                    <select
                        value={form.categoria_id}
                        onChange={(e) => atualizarCampo("categoria_id", e.target.value)}
                        className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 w-full bg-white text-gray-500"
                    >
                    <option value="">Categoria</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}> {cat.nome} </option>
                    ))}
                    </select>

                    <h1 className="text-gray-700 text-3xl text-center"> Descrição da loja </h1>
                    <input 
                        placeholder="descrição"
                        value={form.descricao}
                        onChange={(e) => atualizarCampo("descricao", e.target.value)} 
                        className="bg-white rounded-full px-4 py-2 text-gray-500 focus:outline-none focus:ring-2"
                    />

                    <div className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-2">
                        <p className="tex-sm text-gray-500"> URL da logo </p>
                        <input
                            placeholder="https//..."
                            value={form.logo_url}
                            onChange={(e) => atualizarCampo("logo_url", e.target.value)}
                            className="border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 w-full"
                        />
                        {form.logo_url && (
                            <img
                            src={form.logo_url}
                            alt="preview da logo"
                            className="w-16 h-16 object-cover rounded-full mt-2"
                            />
                        )}
                    </div>
                    
                    <div className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500"> URL do sticker </p>
                        <input
                            placeholder="https//..."
                            value={form.sticker_url}
                            onChange={(e) => atualizarCampo("sticker_url", e.target.value)}
                            className="border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 w-full"
                        />
                        {form.sticker_url && (
                            <img
                            src={form.sticker_url}
                            alt="preview do sticker"
                            className="w-16 h-16 object-cover rounded-full mt-2"
                            />
                        )}
                    </div>

                    <div className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500"> URL do banner </p>
                        <input
                            placeholder="https//..."
                            value={form.banner_url}
                            onChange={(e) => atualizarCampo("banner_url", e.target.value)}
                            className="border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 w-full"
                        />
                        {form.banner_url && (
                            <img
                            src={form.banner_url}
                            alt="preview do banner"
                            className="w-16 h-16 object-cover rounded-full mt-2"
                            />
                        )}
                    </div>

                    {erro && <p className="text-red-500 text-sm text-center"> {erro} </p>}

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
                            {carregando ? "salvando..." : "salvar..."}
                        </button>
                    </div>
                </div>
            </Modal>
        )}
        </>
    )

}