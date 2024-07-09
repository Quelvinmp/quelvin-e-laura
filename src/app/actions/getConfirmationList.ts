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

  try {


    const doc = new GoogleSpreadsheet(process.env.SHEET_ID as string, serviceAccountAuth);;

    doc.resetLocalCache();

    await doc.loadInfo()

    const rows = await doc.sheetsByIndex[1].getRows()

    const confirmationList = rows.map((row) => {
      return {
        code: row.get('code'),
        originalList: row.get('originalList')?.split(','),
        confirmedList: row.get('confirmedList')?.split(','),
        unconfirmedList: row.get('unconfirmedList')?.split(',')
      }
    })

    const currentConfirmationList = confirmationList.find((row) => row.code === code)

    if (!currentConfirmationList) {
      return { message: 'Não foi possível carregar a lista de confirmação. Tente novamente mais tarde!' }
    }

    return currentConfirmationList;
  } catch (error) {
    return { message: 'Não foi possível carregar a lista de confirmação. Tente novamente mais tarde!' };
  }
}