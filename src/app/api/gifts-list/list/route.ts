import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


export async function GET() {

  const serviceAccountAuth = new JWT({
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const doc = new GoogleSpreadsheet(process.env.SHEET_ID as string, serviceAccountAuth);;

  doc.resetLocalCache();

  await doc.loadInfo()


  const rows = await doc.sheetsByIndex[0].getRows()

  const wishList = rows.map((row) => {
    return {
      id: row.get('id'),
      name: row.get('name'),
      description: row.get('description'),
      link: row.get('link'),
      image: row.get('image'),
      boughtBy: row.get('boughtBy') || '',
      type: row.get('type'),
      local: row.get('local'),
      preferences: row.get('preferences'),
      isSugestion: row.get('isSugestion') === 'sim' ? true : false,
      isRealGift: row.get('isRealGift') === 'sim' ? true : false,
      isActive: row.get('isActive') === 'sim' ? true : false,
    }
  })

  const response = NextResponse.json({ wishList });

  response.headers.set('Cache-Control', 'no-store, max-age=0');

  return response;
}