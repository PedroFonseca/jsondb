import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const loadedDBs = {} as { [key: string]: JsonDB };

// Initializes a new dababase. If there's already a file with that name, it loads it instead.
// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
const initDB = (name: string): JsonDB => new JsonDB(new Config(`dbs\\${name}`, true, false, '/'));

// Fetches a loaded database or initializes it if it's not loaded yet
export default (name: string): JsonDB => {
  // If the db is not loaded yet then we create it
  if (loadedDBs[name] === undefined) {
    loadedDBs[name] = initDB(name);
  }

  return loadedDBs[name];
};
