const { Client } = require('pg');
const print = require('./_utils/print');

const dbCreds = {
  user: 'read.exchange.admin',
  host: 'localhost',
  database: 'read1',
  password: 'admin@24',
  port: 5432,
};

module.exports = async () => {
  const client = new Client(dbCreds);

  try {
    await client.connect();
    const init = await client.query('SELECT NOW()');
    print.log(`${init.rows[0].now ? 'CONNECTED' : 'FAILED'} | ${dbCreds.host} | ${dbCreds.database} | ${dbCreds.port}`);
  } catch (e) {
    if (e.code === '42601') {
      print.error(`Postgres syntax error: ${e.message} at position ${e.position}`);
    } else {
      throw e;
    }
  } finally {
    await client.end();
  }
  return client;
};
