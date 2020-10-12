import { JsonDB } from 'node-json-db';
import getDB from './getDB';

type ObjectType = { [key: string]: unknown };
const listName = '_listDBlist_';

const logMessage = (message: string): void => {
  if (process.env.DEBUG === 'TRUE') console.log(`${message}`);
};

const getCurrentDbVersion = (db: JsonDB, dbname: string) => {
  try {
    const currentVersions = db.getData('/dbs');
    return currentVersions[dbname] ?? 0;
  } catch (e) {
    return 0;
  }
};

const addDb = (dbname: string, isWriteOperation: boolean) => {
  if (!isWriteOperation) return;
  const db = getDB(listName);
  const currentVersion = getCurrentDbVersion(db, dbname);
  db.push('/dbs', { [dbname]: currentVersion + 1 }, false);
};

const executeOperation = (
  dbname: string,
  operation: (db: JsonDB) => ObjectType | void,
  isWriteOperation = true,
): ObjectType => {
  try {
    addDb(dbname, isWriteOperation);

    const db = getDB(dbname);
    const result = operation(db);

    logMessage(`Success ${operation}`);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    logMessage(`Error ${operation}: ${error.message}`);
    return {
      success: false,
      operation,
      error: error.message,
    };
  }
};

export const readDB = (dbname: string, path: string): unknown =>
  executeOperation(dbname, (db: JsonDB) => db.getData(path));

export const updateDB = (dbname: string, path: string, data: unknown): unknown =>
  executeOperation(dbname, (db: JsonDB) => db.push(path, data, true));

export const patchDB = (dbname: string, path: string, data: unknown): unknown =>
  executeOperation(dbname, (db: JsonDB) => db.push(path, data, false));

export const reloadDB = (dbname: string): unknown => {
  getDB(dbname).reload();
  return { success: true };
};

export const listDBs = (): unknown => {
  try {
    return {
      success: true,
      data: getDB(listName).getData('/dbs'),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
