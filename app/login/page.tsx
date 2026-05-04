import Link from 'next/link'
import Image from 'next/image'

export default function Login() { return (
    <main className="bg-[#F6F3E4] flex items-center">
        <div className="">
            <Image
            src="/images/logo_stock.io.png"
            width={421}
            height={267}
            alt="Logo Stock.io"
            />
            <Image
            src="/images/stockles_caixa.png"
            width={512.55}
            height={1118.5}
            alt="Mascote Stockles segurando uma caixa."/>
        </div>
        <div className="bg-[#171918] p-8 gap-4 w-[654px] h-[1068px]">
            <h1>Bem vindo de volta!</h1>
            <form className="flex flex-col">
                <input type="email"
                name="email"
                placeholder="Email"
                aria-label="E-mail"
                className="bg-[#FFFFFF] w-[504px] h-[42px]"
                />
                <input type="password"
                name="senha"
                placeholder="Senha"
                aria-label="Senha"
                className="bg-[#FFFFFF] w-[504px] h-[42px]"
                />
                <p><Link href="/recuperar-conta">Esqueceu sua senha?</Link></p>
                <button type="submit">Entrar</button>
                <p>Não possui uma conta? <Link href="/cadastro">Cadastre-se</Link></p>
            </form>
        </div>
    </main>
) }