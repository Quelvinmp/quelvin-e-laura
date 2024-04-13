import googleConfig from "@/app/services/google";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const name = searchParams.get('name')

  if (!id && !name) {
    return NextResponse.json({ message: 'Id do item não informado' })
  }

  const doc = await googleConfig();

  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[0]

  const rows = await sheet.getRows()

  const giftItem = rows.find((row) => row.get('id') === id)

  if (!giftItem) {
    return NextResponse.json({ message: 'Item não encontrado' })
  }

  giftItem.set('boughtBy', name)
  await giftItem.save()

  return NextResponse.json({ message: 'Item comprado com sucesso' })
}