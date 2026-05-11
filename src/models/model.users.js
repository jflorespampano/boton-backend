import controllerDbSqlite from './controller.db.sqlite.js';

/**
 * 
 * @param {object} dbController controlado de base de datos
 * @returns {object} un modelo de usuarios con métodos para obtener todos los usuarios, obtener un usuario por id y crear un nuevo usuario {getAll, get, create}
 */
function modelUsers(dbController=null){
    const {open, run, get:getOne, all, close}=dbController

    /**
     * 
     * @returns {array} arreglo de objetos de usuarios [{},{},...]
     */
    function getAll(){
        open()
        const query = "select * from users;"
        const personas = all(query)
        close()
        return (personas)
    }

    /**
     * 
     * @param {number} id del usuario
     * @returns {object} un objeto de usuario {id: 1, name: "ana", username: "an1"}
     */
    function get(id){
        open()
        const query = "select * from users where id=?;"
        const personas = getOne(query, [id])
        close()
        return(personas)
    }

    /**
     * 
     * @param {object} datos del usuario {name: "ana", username: "an1"}
     * @returns {object} el objeto del usuario creado {changes: 1, lastInsertRowid: 1}
     */
    function create(datos){
    // console.log("recibido",datos)
        const sql=`
        insert into users(name,username,email,password,matricula,telefono,rol) 
        values(@name,@username,@email,@password,@matricula,@telefono,@rol)
        `
        open()
        const resp=run(sql, datos)
        close()
        return resp
    }

    function put(datos){
        let sql=`update users set`
        const logInit=sql.length

        sql+= datos.name? ` name=@name`:''
        sql+= datos.username? `, username=@username`:''
        sql+= datos.email? `, email=@email`:''
        sql+= datos.password? `, password=@password`:''
        sql+= datos.matricula? `, matricula=@matricula`:''
        sql+= datos.telefono? `, telefono=@telefono`:''
        sql+= datos.rol? `, rol=@rol`:''
        sql+= datos.mensaje_sos_global? `, mensaje_sos_global=@mensaje_sos_global`:''
        if(! (sql.length>logInit)){throw new Error("Debe haber al menos 1 campo a modoficar")}
        sql+=` where id=@id`
        open()
        const resp=run(sql, datos)
        close()
        return resp
        }
        // return ({changes: 71, lastInsertRowid: 71, sql, datos})
  
    /**
     * 
     * @param {number} idUser ID del usuario
     * @param {string} nuevoMensaje El nuevo mensaje personalizado
     */
    function updateMensajeSOS(idUser, nuevoMensaje){
        const sql = `UPDATE users SET mensaje_sos_global = @mensaje WHERE id = @id`
        open()
        const resp = run(sql, { mensaje: nuevoMensaje, id: idUser })
        close()
        return resp
    }

    
    return {
        getAll,
        get,
        create,
        put,
        updateMensajeSOS
    }
}

export default modelUsers;
