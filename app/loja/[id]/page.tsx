import LojaPage from "../LojaPage";

interface LojaParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function TelaLoja({ params }: LojaParams) {
  const { id } = await params;

  return <LojaPage idLoja={Number(id)} />;
}
