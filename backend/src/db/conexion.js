import mysql from 'mysql2/promise';

// Crear una conexión a la base de datos usando las variables de entorno
let DB = null;


(async () => {
  try {
    DB = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log("Conectado a la base de datos");

    // Prueba de consulta
    const [rows] = await DB.execute("SELECT 1 + 1 AS result");
    console.log("Prueba de conexión exitosa:", rows);

  } catch (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    process.exit(1);
  }
})();

export default DB;