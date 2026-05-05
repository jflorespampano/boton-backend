import controllerDbSqlite from './controller.db.sqlite.js';

function modelContacts(dbController=null){

    const {open, run, get:getOne, all, close}=dbController

    /**
     * @param {number} idUser id de usuario
     * @returns {array} arreglo de objetos de contactos [{},{},...]
     */
    function getAll(idUser){
        open()
        const query = `select * from contacts 
            where user_id=${idUser};
        `
        const contacts = all(query)
        close()
        return (contacts)
    }

    /**
     * 
     * @param {number} idUser id del usuario
     * @param {number} idContact id del contacto
     * @returns {object} un objeto de contacto {id: 1, name: "ana", email: "", telefono:"", user_id:1}
     */
    function get(idUser,idContact){
        open()
        const query =  `select * from contacts 
            where user_id=? and id=?;
        `
        const contacts = getOne(query, [idUser,idContact])
        close()
        return(contacts)
    }

    /**
     * 
     * @param {object} datos del contacto {name: "ana", email: "", telefono:"", user_id:1}
     * @returns {object} el objeto del usuario creado {changes: 1, lastInsertRowid: 1}
     */
    function create(datos){
    // console.log("recibido",datos)
        const sql=`
        insert into contacts(name,email,telefono,user_id) 
        values(@name,@email,@telefono,@user_id)
        `
        open()
        const resp=run(sql, datos)
        close()
        return resp
    }

    /**
     * 
     * @param {object} datos del contacto {id: 0, name: "ana", email: "", telefono:"", user_id:0}
     * @returns 
     */
    function put(datos){
        let sql=`update contacts set`
        const logInit=sql.length

        sql+= datos.name? ` name=@name`:''
        sql+= datos.email? `, email=@email`:''
        sql+= datos.telefono? `, telefono=@telefono`:''

        if(! (sql.length>logInit)){throw new Error("Debe haber al menos 1 campo a modoficar")}
        sql+=` where id=@id and user_id=@user_id`
        open()
        const resp=run(sql, datos)
        close()
        return resp
        // return ({changes: 71, lastInsertRowid: 71, sql, datos})
    }
    return {
        getAll,
        get,
        create,
        put
    }
}

export default modelContacts