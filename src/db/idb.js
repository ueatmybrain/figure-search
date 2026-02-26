import Dexie from 'dexie';

export const db = new Dexie('FigureSearch');
db.version(1).stores({
  figure: 'key',
  dict: '++id',
});

// (optional) make editor happy
db.figure = db.table('figure');
db.dict = db.table('dict');

// Helpers
export async function figureSet(key, value) {
  value.capturedAt = Date.now();
  return db.figure.put({ key, value });
}

export async function figureGet(key) {
  const row = await db.figure.get(key);
  return row;
}

export async function figureHas(key) {
  return (await db.figure.get(key)) != null;
}

export async function figureDelete(key) {
  return db.figure.delete(key);
}

export async function figureKeys() {
  // all keys (sorted)
  return db.figure.orderBy('key').keys();
}

export async function figureEntries() {
  const out = [];
  await db.figure.each((row) => out.push({ key: row.key, value: row.value }));
  console.log(out);
  return out;
}

export async function idbClear() {
  return db.figure.clear();
  return db.dict.clear();
}
export async function setDictEntry(value) {
  return db.dict.add({ value });
}

export async function deleteDictEntry(id) {
  return db.dict.delete(id);
}
export async function dictionaryEntries() {
  return db.dict.toArray();
}
