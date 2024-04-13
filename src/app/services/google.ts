import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import credentials from '../../../credentials/google-sheets-api.json'

export default async function googleConfig(): Promise<GoogleSpreadsheet> {
  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const doc = new GoogleSpreadsheet(credentials.sheet_id, serviceAccountAuth);

  return doc
}