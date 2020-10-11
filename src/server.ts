import express from 'express';
import { config } from 'dotenv';
import { JsonDB } from 'node-json-db';
import getDB from './getDB';

config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.get('/', (request, response) =>
  response.json({
    message:
      'DB server up and running! Use format /dbname to access a database',
  }),
);

type ObjectType = { [key: string]: unknown };

const logMessage = (message: string): void => {
  if (process.env.DEBUG === 'TRUE') console.log(`${message}`);
};

const executeOperation = (
  dbname: string,
  operation: (db: JsonDB) => ObjectType | void,
): ObjectType => {
  try {
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

app.get('/:dbname', (request, response) => {
  const path = request.query.path as string;
  const operation = (db: JsonDB) => db.getData(path);
  const result = executeOperation(request.params.dbname, operation);

  response.json(result);
});

app.post('/:dbname', (request, response) => {
  const path = request.query.path as string;
  const operation = (db: JsonDB) => db.push(path, request.body, true);
  const result = executeOperation(request.params.dbname, operation);

  response.json(result);
});

app.put('/:dbname', (request, response) => {
  const path = request.query.path as string;
  const operation = (db: JsonDB) => db.push(path, request.body, true);
  const result = executeOperation(request.params.dbname, operation);

  response.json(result);
});

app.patch('/:dbname', (request, response) => {
  const path = request.query.path as string;
  const operation = (db: JsonDB) => db.push(path, request.body, false);
  const result = executeOperation(request.params.dbname, operation);

  response.json(result);
});

app.get('/:dbname/reload', (request, response) => {
  const db = getDB(request.params.dbname);
  db.reload();
  response.json({ success: true });
});

app.listen(port, () => {
  console.log(`Back-end started in ${port} port!`);
});
