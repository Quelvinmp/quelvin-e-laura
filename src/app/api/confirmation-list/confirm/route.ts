import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


export async function POST(req: Request, res: NextResponse) {

  const searchParams = req.url.split('?')[1]
  const code = searchParams.split('=')[1]
  const request = await req.json()
  const confirmedList = request?.confirmedList?.join(',') || '';
  const unconfirmedList = request?.unconfirmedList?.join(',') || '';

  if (!code && !confirmedList && !unconfirmedList) {
    return NextResponse.json({ message: 'Não foi possível concluir ação. Tente novamente!' })
  }

  try {
    const serviceAccountAuth = new JWT({
      email: process.env.CLIENT_EMAIL,
      key: process.env.PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID as string, serviceAccountAuth);

    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[1]

    const rows = await sheet.getRows()

    const confirmationList = rows.find((row) => row.get('code') === code)

    if (!confirmationList) {
      return NextResponse.json({ message: 'Houve um problema com a lista de confirmação... Tente novamente!' })
    }

    confirmationList.set('confirmedList', confirmedList)
    confirmationList.set('unconfirmedList', unconfirmedList)
    await confirmationList.save()

    return NextResponse.json({ message: 'Agradecemos pela confirmação!!' })
  } catch (error) {
    return NextResponse.json({ message: 'Não foi possível concluir ação. Tente novamente!' })
  }
}