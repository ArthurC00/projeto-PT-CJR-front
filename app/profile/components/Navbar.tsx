import Image from "next/image";
import stockioLogo from "../../../public/logoStockio.svg";
import Link from "next/link";

export default function Navbar() {
  function AuthButtons() {
    return (
      <main className="flex text-white items-center justify-center gap-10">
        <Link
          href="/login"
          className="font-spartan font-px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          LOGIN
        </Link>

        <Link
          href="/cadastro"
          className="font-spartan bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
        >
          CADASTRE-SE
        </Link>
      </main>
    );
  }
  return (
    <main className="flex w-full py-3 bg-black items-center justify-between px-16">
      <Image src={stockioLogo} width={220} alt="stock.io"></Image>
      <AuthButtons />
    </main>
  );
}
