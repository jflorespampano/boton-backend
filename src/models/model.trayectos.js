import controllerDbSqlite from './controller.db.sqlite.js';

function modelTrayectos(dbController = null) {

    const { open, run, get: getOne, all, close } = dbController;

    /**
     * Obtener todos los trayectos históricos de un usuario específico
     * @param {number} idUser - ID del usuario en sesión
     * @returns {array} Arreglo de objetos de trayectos [{}, {}, ...]
     */
    function getAll(idUser) {
        open();
        const query = `SELECT * FROM trayectos 
                       WHERE user_id = ${idUser}
                       ORDER BY iniciado_at DESC;`;
        const trayectos = all(query);
        close();
        return trayectos;
    }

    /**
     * Obtener un trayecto específico por su ID único
     * @param {number} idUser - ID del usuario en sesión
     * @param {number} idTrayecto - ID específico del viaje
     * @returns {object|null} Objeto del trayecto configurado
     */
    function get(idUser, idTrayecto) {
        open();
        const query = `SELECT * FROM trayectos 
                       WHERE user_id = ? AND id = ?;`;
        const trayecto = getOne(query, [idUser, idTrayecto]);
        close();
        return trayecto;
    }

    /**
     * Registrar un nuevo trayecto de prevención (Nivel 1)
     * @param {object} datos - Payload JSON proveniente de la app en Android
     * esperado: { user_id, destino, latitud_origen, longitud_origen, latitud_destino, longitud_destino, tiempo_estimado_min, tipo_acompanamiento, vence_at }
     * @returns {object} Estado de la operación SQLite {changes: 1, lastInsertRowid: X}
     */
    function create(datos) {
        const sql = `
            INSERT INTO trayectos (
                user_id, destino, latitud_origen, longitud_origen, 
                latitud_destino, longitud_destino, tiempo_estimado_min, 
                tipo_acompanamiento, estado, vence_at
            ) VALUES (
                @user_id, @destino, @latitud_origen, @longitud_origen, 
                @latitud_destino, @longitud_destino, @tiempo_estimado_min, 
                @tipo_acompanamiento, 'activo', @vence_at
            );
        `;
        open();
        const resp = run(sql, datos);
        close();
        return resp;
    }

    /**
     * Actualizar dinámicamente un trayecto (Cambiar estado, registrar cancelaciones o confirmaciones)
     * @param {object} datos - Atributos variables a modificar { id, user_id, estado, confirmado_at, cancelado_at }
     * @returns {object} Estado de filas alteradas en la base de datos
     */
    function put(datos) {
        let sql = `UPDATE trayectos SET`;
        const logInit = sql.length;

        // Construcción dinámica de la query basada en los campos enviados
        sql += datos.estado ? ` estado = @estado` : '';
        sql += datos.confirmado_at ? `${sql.length > logInit ? ',' : ''} confirmado_at = @confirmado_at` : '';
        sql += datos.cancelado_at ? `${sql.length > logInit ? ',' : ''} cancelado_at = @cancelado_at` : '';

        // Validación de campos
        if (!(sql.length > logInit)) {
            throw new Error("Debe proporcionar al menos un campo para modificar ('estado', 'confirmado_at' o 'cancelado_at')");
        }

        // Restricción relacional para seguridad del usuario
        sql += ` WHERE id = @id AND user_id = @user_id;`;

        open();
        const resp = run(sql, datos);
        close();
        return resp;
    }

    return {
        getAll,
        get,
        create,
        put
    };
}

export default modelTrayectos;