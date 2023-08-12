
import mysql from "mysql2";
import "dotenv/config";


const connectionDB = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export { connectionDB };
