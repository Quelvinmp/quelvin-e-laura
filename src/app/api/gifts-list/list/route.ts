import { NextResponse } from "next/server";
import googleConfig from "@/app/services/google";

export async function GET() {
  const doc = await googleConfig();

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
    }
  })

  return NextResponse.json({ wishList });
}