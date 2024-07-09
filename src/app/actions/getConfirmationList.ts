'use server'

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function getConfirmationList(code: string) {
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

  const rows = await doc.sheetsByIndex[1].getRows()

  const confirmationList = rows.map((row) => {
    return {
      code: row.get('code'),
      originalList: row.get('originalList'),
      confirmedList: row.get('confirmedList'),
      unconfirmedList: row.get('unconfirmedList'),
    }
  })

  const currentConfirmationList = confirmationList.find((row) => row.code === code)

  return currentConfirmationList;
}