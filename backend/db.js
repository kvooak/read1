const { Client } = require('pg');
const arangojs = require('arangojs')

const print = require('./_utils/print');

const dbPostgresConnect = async () => {
  const dbCreds = {
    user: 'read.exchange.admin',
    host: process.env.DB_HOST || 'localhost',
    database: 'read1',
    password: 'admin@24',
    port: 5432,
  };

  const client = new Client(dbCreds);

  try {
    await client.connect();
    const init = await client.query('SELECT NOW()');
    print.log(`POSTGRES ${init.rows[0].now ? 'CONNECTED' : 'FAILED'} | ${dbCreds.host} | ${dbCreds.database} | ${dbCreds.port}`);
  } catch (e) {
    if (e.code === '42601') {
      print.error(`Postgres syntax error: ${e.message} at position ${e.position}`);
    } else {
      throw e;
    }
  }
  return client;
};

const dbArangoConnect = async () => {
  const ARANGO_DB_URL = process.env.ARANGO_DB_URL || 'http://127.0.0.1:8529';
  const ARANGO_DB_USER = process.env.ARANGO_DB_USER || 'root';
  const ARANGO_DB_PASSWORD = process.env.ARANGO_DB_PASSWORD || '';
  const ARANGO_DB_NAME = process.env.ARANGO_DB_NAME || 'read1';

  const connect = async () => {
    // Connect to Arango DB

    const db = new arangojs.Database({
      url: ARANGO_DB_URL,
    });

    await db.login(
      ARANGO_DB_USER,
      ARANGO_DB_PASSWORD,
    );

    const dbObject = db.database(ARANGO_DB_NAME);
    print.log(await db.version());
    return dbObject;
  };

  const connected = await connect();
  print.log(`ARANGO CONNECTED ${ARANGO_DB_URL} ${ARANGO_DB_USER} ${ARANGO_DB_NAME}`);
  return connected;
};

module.exports = {
  dbPostgresConnect,
  dbArangoConnect,
};
