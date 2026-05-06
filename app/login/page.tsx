import Link from 'next/link'
import Image from 'next/image'

export default function Login() { return (
    <main className="bg-[#F6F3E4] flex items-center">
        <div className="">
            <Image
            src="/images/logo_stock.io.png"
            width={421}
            height={222}
            alt="Logo Stock.io"
            />
            <Image
            src="/images/stockles_caixa.png"
            width={514}
            height={802}
            alt="Mascote Stockles segurando uma caixa."/>
        </div>
        <div className="bg-[#171918] p-12 self-end rounded-4xl text-center font-sans ">
            <h1 className="font-black text-4xl m-6 tracking-wide">BEM VINDO DE VOLTA!</h1>
            <form className="flex flex-col">
                <input required
                type="email"
                name="email"
                placeholder="Email"
                aria-label="E-mail"
                // inputs: w-[504px] h-[42px]
                className="bg-[#FFFFFF] text-black rounded-full m-2 h-10 pl-8"
                />
                <input required
                type="password"
                name="senha"
                placeholder="Senha"
                aria-label="Senha"
                className="bg-[#FFFFFF] text-black rounded-full m-2 h-10 pl-8"
                />
                <p className="m-4 font-thin text-sm"><Link href="/recuperar-conta" className="underline">Esqueceu sua senha?</Link></p>
                <button type="submit" className="bg-[#6A38F3] font-bold rounded-full m-2 h-11">ENTRAR</button>
                <p className="text-start m-4 text-lg font-extralight">Não possui uma conta? <Link href="/cadastro" className="text-[#6A38F3] font-medium">Cadastre-se</Link></p>
            </form>
        </div>
    </main>
) }