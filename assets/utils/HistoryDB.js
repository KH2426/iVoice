// utils/HistoryDB.js
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const getDBConnection = async () => {
  return await SQLite.openDatabase({ name: 'TranslatorHistory.db', location: 'default' });
};

export const createTable = async () => {
  const db = await getDBConnection();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      input_text TEXT,
      input_voice TEXT,
      output_text TEXT,
      output_voice TEXT,
      input_language TEXT,
      output_language TEXT
    );
  `);
  db.close();
};

export const insertHistory = async ({
  input_text, input_voice,
  output_text, output_voice,
  input_language, output_language
}) => {
  try {
  const db = await getDBConnection();
  const date = new Date().toISOString();
  await db.executeSql(
    `INSERT INTO history (date, input_text, input_voice, output_text, output_voice, input_language, output_language)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [date, input_text, input_voice, output_text, output_voice, input_language, output_language]
  );
  console.log('✅ Inserted into history');
      db.close();
    } catch (error) {
      console.error('❌ Failed to insert history:', error);
    }
};

export const fetchHistory = async () => {
  try {
    const db = await getDBConnection();
    const results = await db.executeSql(`SELECT * FROM history ORDER BY id DESC`);
    const rows = results[0].rows;
    const items = [];

    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }

    console.log('✅ fetchHistory rows:', rows.length);
    console.log('✅ fetchHistory items:', items);

    db.close();
    return items;
  } catch (error) {
    console.error('❌ fetchHistory error:', error);
    return [];
  }
};

