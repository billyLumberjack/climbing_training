import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const CREDS_PATH = process.env.GOOGLE_SHEETS_CREDS_PATH;
const MODE = process.argv[2] || '--pull';

interface SheetConfig {
  name: string;
  type: 'physical' | 'hangboard' | 'climbing';
  csvPath: string;
  sheetName: string;
  headers: string[];
  // Defines which columns are logging-only (local to CSV, not in Sheet)
  loggingColumnIndices: number[];
}

const sheetConfigs: SheetConfig[] = [
  {
    name: 'Physical',
    type: 'physical',
    csvPath: './physical/current/2026_inizio_estate_RAGionamento.csv',
    sheetName: 'Physical',
    headers: ['Week', 'Day', 'Exercise', 'Set', 'Rep', 'Load', 'Note', 'Rest', 'REPS LOG', 'RPE LOG'],
    loggingColumnIndices: [8, 9] // "Numero Esecuzioni", "Sforzo percepito" (last 2 cols)
  },
  {
    name: 'Hangboard',
    type: 'hangboard',
    csvPath: './hangboard/current/2026_inizio_estate_RAGionamento.csv',
    sheetName: 'Hangboard',
    headers: ['WEEK', 'DAY', 'EXERCISE', 'TIME', 'REPS', 'SETS', 'RPE', 'REPS LOG', 'RPE LOG'],
    loggingColumnIndices: [7, 8] // "REPS LOG", "RPE LOG" (last 2 cols)
  },
  {
    name: 'Climbing',
    type: 'climbing',
    csvPath: './climbing/current/2026_inizio_estate_RAGionamento.csv',
    sheetName: 'Climbing',
    headers: ['Week', 'Day', 'Short description', 'Duration/Sets', 'Movements', 'Reps', 'Rest', 'REPS LOG', 'RPE LOG'],
    loggingColumnIndices: [7, 8] // "REPS LOG", "RPE LOG" (last 2 cols)
  }
];

async function getAuthClient() {
  if (!CREDS_PATH || !fs.existsSync(CREDS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDS_PATH}`);
  }

  const credsContent = fs.readFileSync(CREDS_PATH, 'utf-8');
  const creds = JSON.parse(credsContent);

  const auth = new GoogleAuth({
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
      current.push(field);
      // Preserve ALL rows, including empty ones (for separating sessions)
      result.push(current);
      current = [];
      field = '';
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      field += char;
    }
  }

  if (field || current.length) {
    current.push(field);
    result.push(current);
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

/**
 * T3: Push CSV plan to Google Sheets
 * Takes all columns EXCEPT logging columns and uploads to sheet.
 * Sheet retains its own logging columns separately.
 */
async function pushToSheets() {
  console.log(`📤 [T3] Pushing CSV plan to Google Sheets (${SHEETS_ID})`);

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

      // Header row: keep all columns so logging headers are visible in the Sheet.
      // Data rows: same column count but logging cells blanked (user fills them via T4).
      const rowsToUpload = rows.map((row, rowIdx) => {
        if (rowIdx === 0) return row;
        return row.map((cell, colIdx) =>
          config.loggingColumnIndices.includes(colIdx) ? '' : cell
        );
      });

      // Clear existing data in sheet
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SHEETS_ID,
        range: `${config.sheetName}!A:Z`,
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEETS_ID,
        range: `${config.sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: rowsToUpload,
        },
      });

      const uploadedCols = rowsToUpload[0]?.length || 0;
      console.log(`    ✅ Uploaded ${rowsToUpload.length} rows × ${uploadedCols} cols to ${config.sheetName}`);
      console.log(`       (${config.loggingColumnIndices.length} logging cells blanked, headers preserved)`);
      changeCount++;
    } catch (error) {
      console.error(`    ❌ Error syncing ${config.name}:`, error);
    }
  }

  console.log(`\n✅ Successfully pushed ${changeCount} sheet(s) to Google Sheets\n`);
  process.exit(0);
}

/**
 * T5: Pull logging data from Google Sheets into CSV
 * Takes only the logging columns from sheet and merges them into CSV.
 * Commits and pushes the updated CSV files.
 */
async function pullFromSheets() {
  console.log(`📥 [T5] Pulling logging data from Google Sheets (${SHEETS_ID})`);

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

      // Read current CSV to preserve plan columns
      const existingCsv = fs.readFileSync(config.csvPath, 'utf-8');
      const existingRows = csvToArray(existingCsv);

      if (existingRows.length === 0) {
        console.log(`    ⚠️  CSV file is empty`);
        continue;
      }

      // Fetch all data from sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEETS_ID,
        range: `${config.sheetName}!A:Z`,
      });

      const sheetValues = response.data.values || [];
      if (sheetValues.length === 0) {
        console.log(`    ⚠️  No data found in sheet`);
        continue;
      }

      // CSV is the structural driver: iterate over CSV rows and only overwrite
      // logging cells with the Sheet value at the same column index.
      const mergedRows = existingRows.map((csvRow, idx) => {
        if (idx === 0) return csvRow; // keep CSV header verbatim
        const sheetRow = sheetValues[idx] || [];
        return csvRow.map((cell, colIdx) =>
          config.loggingColumnIndices.includes(colIdx)
            ? (sheetRow[colIdx] ?? cell)
            : cell
        );
      });

      // Write merged data back to CSV
      const csvContent = arrayToCsv(mergedRows);
      fs.writeFileSync(config.csvPath, csvContent);
      console.log(`    ✅ Updated ${config.csvPath} (${mergedRows.length} rows with logging data)`);
      changeCount++;
    } catch (error: any) {
      if (error?.message?.includes('Unable to parse range')) {
        console.log(`    ⚠️  Sheet "${config.sheetName}" not found`);
      } else {
        console.error(`    ❌ Error syncing ${config.name}:`, error);
      }
    }
  }

  // Commit and push if changes were made
  if (changeCount > 0) {
    try {
      // Ensure git identity is set
      let gitName = '';
      try {
        gitName = execSync('git config user.name', { cwd: process.cwd(), stdio: 'pipe' }).toString().trim();
      } catch { /* not set */ }
      if (!gitName) {
        execSync('git config user.name "Climbing Training Sync"', { cwd: process.cwd(), stdio: 'pipe' });
        execSync('git config user.email "sync@training.local"', { cwd: process.cwd(), stdio: 'pipe' });
      }

      // Stage CSV changes
      console.log('\n📝 Staging CSV files...');
      execSync('git add physical/current/*.csv hangboard/current/*.csv climbing/current/*.csv', {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      // Check if there are actually staged changes
      try {
        execSync('git diff --cached --quiet', { cwd: process.cwd() });
        // No changes staged
        console.log('ℹ️  No staged changes (files identical)');
        process.exit(0);
      } catch {
        // Changes are staged, proceed to commit
      }

      // Commit
      console.log('💾 Committing changes...');
      execSync(
        'git commit -m "Sync session logs from Google Sheets\n\nCo-Authored-By: Climbing Training Sync <sync@training.local>"',
        {
          cwd: process.cwd(),
          stdio: 'inherit',
        }
      );

      console.log(`\n✅ Committed ${changeCount} updated CSV file(s) — workflow will push\n`);
      process.exit(0);
    } catch (error: any) {
      console.error('❌ Git error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  } else {
    console.log('\n✅ No changes from Sheets\n');
    process.exit(0);
  }
}

async function main() {
  try {
    if (!SHEETS_ID || !CREDS_PATH) {
      throw new Error('Missing required environment variables: GOOGLE_SHEETS_ID, GOOGLE_SHEETS_CREDS_PATH');
    }

    switch (MODE) {
      case '--push-only':
        // T3: Push CSV plan to Sheet (no git operations)
        await pushToSheets();
        break;
      case '--pull-only':
        // T5: Pull logging data from Sheet, merge into CSV, commit & push
        await pullFromSheets();
        break;
      case '--pull':
        // Legacy: same as --pull-only
        await pullFromSheets();
        break;
      case '--push':
        // Legacy: same as --push-only
        await pushToSheets();
        break;
      default:
        throw new Error(`Unknown mode: ${MODE}. Use --push-only, --pull-only, --push, or --pull`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
