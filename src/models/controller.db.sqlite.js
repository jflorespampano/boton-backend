//no tome encuenta este archivo se usara en proximas clases para crear un modelo de datos, por ahora se usara el modelo de datos que se encuentra en model.users.js
import Database from "better-sqlite3";

function controllerDbSqlite(dbFilePath) {
  let db = null;
  let dbOpen = false;

  return {
    /**
     * abre la base de datos, si ya esta abierta no hace nada, si no esta abierta la abre y marca el estado como abierto
     */
    open() {
      db = new Database(dbFilePath);
      dbOpen = true;
    },

    /**
     * 
     * @param {string} sql por ejemplo "insert into users(name,username) values(@name,@username)"
     * @param {object} params por ejemplo {name: "ana", username: "an1"}
     * @returns {object} el resultado de la consulta, por ejemplo {changes: 1, lastInsertRowid: 1}
     */
    run(sql, params = []) {
      const insertData = db.prepare(sql);
      const r = insertData.run(params);
      return r;
    },

    /**
     * 
     * @param {string} sql por ejmplo "select * from users where id=?;"
     * @param {array} params por ejemplo [1]
     * @returns {object} el resultado de la consulta, por ejemplo {id: 1, name: "ana", username: "an1"}
     */
    get(sql, params = []) {
      const res = db.prepare(sql).get(params);
      return res;
    },

    /**
     * 
     * @param {string} sql por ejemplo "select * from users;"
     * @param {array} params ninguno por ejemplo []
     * @returns {array} el resultado de la consulta, por ejemplo [{id: 1, name: "ana", username: "an1"}, {id: 2, name: "juan", username: "ju2"}]
     */
    all(sql, params = []) {
      const res = db.prepare(sql).all();
      return res;
    },

    /**
     * cierra la base de datos, si ya esta cerrada no hace nada, si esta abierta la cierra y marca el estado como cerrado
     */
    close() {
      console.log("base de datos cerrada");
      if (dbOpen) db.close();
      dbOpen = false;
    },
  };
}

export default controllerDbSqlite;