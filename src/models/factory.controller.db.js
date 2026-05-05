import controllerDbSqlite from './controller.db.sqlite.js';
/**
 * 
 * @param {object} dbdefinition parametros de la dase de datso como {DB_PLATFORM: "sqlite", DB_NAME: "app.db", USER: "root", PASSWORD: "password"}
 * @returns {object} un controlador de base de datos específico según el tipo definido en dbdefinition, por ejemplo un controlador para sqlite
 * @throws {Error} si el tipo de base de datos no es soportado
 */
function controllerDbFactory(dbdefinition) {
  const { DB_PLATFORM } = dbdefinition;
  switch (DB_PLATFORM) {
    case "sqlite":
        const {DB_NAME} = dbdefinition
        const raiz = process.cwd();
        const mydb = `${raiz}/${DB_NAME}`;
        return controllerDbSqlite(mydb);
    default:
      throw new Error(`Tipo de base de datos no soportada: ${DB_PLATFORM}`);
  }
}
export default controllerDbFactory;