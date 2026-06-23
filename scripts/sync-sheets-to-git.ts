import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { google } from 'googleapis';
import { auth as googleAuth } from 'google-auth-library';

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const CREDS_PATH = process.env.GOOGLE_SHEETS_CREDS_PATH;
const MODE = process.argv[2] || '--pull';

interface SheetConfig {
  name: string;
  type: 'physical' | 'hangboard' | 'climbing';
  csvPath: string;
  sheetName: string;
  headers: string[];
}

const sheetConfigs: SheetConfig[] = [
  {
    name: 'Physical',
    type: 'physical',
    csvPath: './physical/current/2026_inizio_estate_RAGionamento.csv',
    sheetName: 'Physical',
    headers: ['Week', 'Day', 'Exercise', 'Set', 'Rep', 'Load', 'Note', 'Rest', 'Numero Esecuzioni', 'Sforzo percepito']
  },
  {
    name: 'Hangboard',
    type: 'hangboard',
    csvPath: './hangboard/current/2026_inizio_estate_RAGionamento.csv',
    sheetName: 'Hangboard',
    headers: ['WEEK', 'DAY', 'EXERCISE', 'TIME', 'REPS', 'SETS', 'RPE', 'REST', 'NOTES']
  },
  {
    name: 'Climbing',
    type: 'climbing',
    csvPath: './climbing/current/2026_inizio_estate_RAGionamento.csv',
    sheetName: 'Climbing',
    headers: ['Week', 'Day', 'Short description', 'Duration/Sets', 'Movements', 'Reps', 'Rest']
  }
];

async function getAuthClient() {
  if (!CREDS_PATH || !fs.existsSync(CREDS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDS_PATH}`);
  }

  const credsContent = fs.readFileSync(CREDS_PATH, 'utf-8');
  const creds = JSON.parse(credsContent);

  const auth = new googleAuth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth.getClient();
}

function csvToArray(str: string): string[][] {
  const result: string[][] = [];
  let current: string[] = [];
  let inside = false;
  let field = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (char === '"') {
      if (inside && nextChar === '"') {
        field += '"';
        i++;
      } else {
        inside = !inside;
      }
    } else if (char === ',' && !inside) {
      current.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !inside) {
      if (field || current.length) {
        current.push(field);
        if (current.some(c => c.trim())) {
          result.push(current);
        }
        current = [];
        field = '';
      }
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      field += char;
    }
  }

  if (field || current.length) {
    current.push(field);
    if (current.some(c => c.trim())) {
      result.push(current);
    }
  }

  return result;
}

function arrayToCsv(arr: string[][]): string {
  return arr
    .map(row =>
      row
        .map(field => {
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        })
        .join(',')
    )
    .join('\n');
}

async function pullFromSheets() {
  console.log(`📥 Pulling from Google Sheets (${SHEETS_ID})`);

  if (!SHEETS_ID) {
    throw new Error('GOOGLE_SHEETS_ID environment variable not set');
  }

  const authClient = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  let changeCount = 0;

  for (const config of sheetConfigs) {
    console.log(`  📋 Syncing ${config.name}...`);

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEETS_ID,
        range: `${config.sheetName}!A:Z`,
      });

      const values = response.data.values || [];
      if (values.length === 0) {
        console.log(`    ⚠️  No data found in sheet`);
        continue;
      }

      // Write to CSV
      const csvContent = arrayToCsv(values as string[][]);
      const dir = path.dirname(config.csvPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(config.csvPath, csvContent);
      console.log(`    ✅ Wrote ${values.length} rows to ${config.csvPath}`);
      changeCount++;
    } catch (error) {
      console.error(`    ❌ Error syncing ${config.name}:`, error);
    }
  }

  // Git commit if changes made
  if (changeCount > 0) {
    try {
      execSync('git add physical/current/*.csv hangboard/current/*.csv climbing/current/*.csv', {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      execSync(
        'git commit -m "Sync session logs from Google Sheets\n\nCo-Authored-By: Climbing Training Sync <sync@training.local>"',
        {
          cwd: process.cwd(),
          stdio: 'inherit',
        }
      );

      console.log(`\n✅ Committed ${changeCount} updated CSV file(s)`);
      process.exit(0);
    } catch (error) {
      console.log('ℹ️  No changes to commit (git error or no diff)');
      process.exit(0);
    }
  } else {
    console.log('\n✅ No changes needed');
    process.exit(0);
  }
}

async function pushToSheets() {
  console.log(`📤 Pushing to Google Sheets (${SHEETS_ID})`);

  if (!SHEETS_ID) {
    throw new Error('GOOGLE_SHEETS_ID environment variable not set');
  }

  const authClient = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  let changeCount = 0;

  for (const config of sheetConfigs) {
    console.log(`  📋 Syncing ${config.name}...`);

    try {
      if (!fs.existsSync(config.csvPath)) {
        console.log(`    ⚠️  CSV file not found: ${config.csvPath}`);
        continue;
      }

      const csvContent = fs.readFileSync(config.csvPath, 'utf-8');
      const rows = csvToArray(csvContent);

      if (rows.length === 0) {
        console.log(`    ⚠️  CSV file is empty`);
        continue;
      }

      // Clear existing data
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SHEETS_ID,
        range: `${config.sheetName}!A:Z`,
      });

      // Write new data
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEETS_ID,
        range: `${config.sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: rows,
        },
      });

      console.log(`    ✅ Uploaded ${rows.length} rows to ${config.sheetName}`);
      changeCount++;
    } catch (error) {
      console.error(`    ❌ Error syncing ${config.name}:`, error);
    }
  }

  console.log(`\n✅ Pushed ${changeCount} sheet(s) to Google Sheets`);
  process.exit(0);
}

async function autoSync() {
  // Check file modification times and sync the stale direction
  console.log('🔄 Auto-detecting sync direction...');
  // For now, default to pull (can be enhanced with timestamp logic)
  await pullFromSheets();
}

async function main() {
  try {
    if (!SHEETS_ID || !CREDS_PATH) {
      throw new Error('Missing required environment variables: GOOGLE_SHEETS_ID, GOOGLE_SHEETS_CREDS_PATH');
    }

    switch (MODE) {
      case '--pull':
        await pullFromSheets();
        break;
      case '--push':
        await pushToSheets();
        break;
      case '--auto':
        await autoSync();
        break;
      default:
        throw new Error(`Unknown mode: ${MODE}. Use --pull, --push, or --auto`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
