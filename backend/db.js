const arangojs = require('arangojs')

const print = require('./_utils/print');

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
    return dbObject;
  };

  const connected = await connect();
  print.log(`ARANGO CONNECTED ${ARANGO_DB_URL} ${ARANGO_DB_USER} ${ARANGO_DB_NAME}`);
  return connected;
};

module.exports = {
  dbArangoConnect,
};
