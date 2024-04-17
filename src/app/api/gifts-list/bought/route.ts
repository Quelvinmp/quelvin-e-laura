import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';



export async function POST(req: NextRequest, res: NextResponse) {

  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const name = searchParams.get('name')

  if (!id && !name) {
    return NextResponse.json({ message: 'Id do item não informado' })
  }

  const serviceAccountAuth = new JWT({
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const doc = new GoogleSpreadsheet(process.env.SHEET_ID as string, serviceAccountAuth);

  doc.resetLocalCache();

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