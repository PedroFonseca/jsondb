import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { readDB, updateDB, patchDB, reloadDB, listDBs } from './execDbOperation';

config();
const port = process.env.PORT || 3000;
const app = express();
// Compress HTTP responses
app.use(compression());
// Uncompress gzip requests
app.use(bodyParser.json({ type: 'application/gzip', limit: '50mb' }));
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (request, response) =>
  response.json({
    message: 'DB server up and running!',
  }),
);

app.get('/operations/list', (request, response) => {
  response.json(listDBs());
});

app.get('/:dbname', (request, response) => {
  response.json(readDB(request.params.dbname, request.query.path as string));
});

app.post('/:dbname', (request, response) => {
  response.json(updateDB(request.params.dbname, request.query.path as string, request.body));
});

app.put('/:dbname', (request, response) => {
  response.json(updateDB(request.params.dbname, request.query.path as string, request.body));
});

app.patch('/:dbname', (request, response) => {
  response.json(patchDB(request.params.dbname, request.query.path as string, request.body));
});

app.get('/:dbname/reload', (request, response) => {
  response.json(reloadDB(request.params.dbname));
});

app.listen(port, () => {
  console.log(`Back-end started in ${port} port!`);
});
