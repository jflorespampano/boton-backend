import express from 'express';
import modelUsers from '../models/model.users.js';
import modelContacts from '../models/model.contacts.js'
import modelTrayectos from '../models/model.trayectos.js'

const getRouterUser = (controllerDB=null) => {
    const modelUsersInstance = modelUsers(controllerDB);
    const modelContactInstance = modelContacts(controllerDB);
     const modelTrayectosInstance = modelTrayectos(controllerDB);
    const routerUser = express.Router();

    //usuarios
    /**
     * obtener un usuario espera una url asi: http://localhost:3000/usuarios/3
     */
    routerUser.get('/:id', (req, res) => {
        const userId = req.params.id;
        const user=modelUsersInstance.get(userId)
        res.send(user);
    });

    /**
     * obtener todos los usuarios espera una url asi: http://localhost:3000/usuarios
     */
    routerUser.get('/', (req, res) => {
          const resp=modelUsersInstance.getAll()
        res.send(resp);
    }); 

    /**
     * actualizar un usuario espera una url asi: http://localhost:3000/usuarios
     * y los datos json en el body
     */
    routerUser.put('/', (req, res) => {
        const userData = req.body;
        const data = req.body;
        //console.log(`${name}, ${username}`);
        const resp=modelUsersInstance.put(data)
        res.send(resp);
    });

    /**
     * obtener todos los contactos
     */
    routerUser.get('/:id/contacts', (req, res) => {
        const userId = req.params.id;
        const resp=modelContactInstance.getAll(userId)
        // lógica para obtener los contactos del usuario con ese id
        // res.json({ userId, contacts: [] });
        res.json(resp);
    });

    /**
     * agregar un contacto
     * datos en body {"name":"ana, "email":"","telefono":"", "user_id":"3"}
     */
    routerUser.post('/:id/contacts', (req, res) => {
        const contactData = req.body;
        const resp=modelContactInstance.create(contactData)
        // res.json({ userId, agregar: "yes" });
        res.json(resp);
    });

    /**
     * obtener un contacto específico de un usuario
     */
    routerUser.get('/:id/contacts/:cid', (req, res) => {
        const idUser = req.params.id;
        const idContact = req.params.cid;
        // lógica para obtener los contactos del usuario con ese id
        const resp=modelContactInstance.get(idUser,idContact)
        // res.json({ userId, cid });
        res.json(resp);
    });

    /**
     * actualizar un contacto
     */
    routerUser.put('/:id/contacts/:cid', (req, res) => {
        const user_id = req.params.id;
        const id = req.params.cid;
        const data=req.body
        const datos = {...data, id, user_id};
        // lógica para actualizar los contactos del usuario con ese id, cid
        const resp=modelContactInstance.put(datos)
        res.json(resp);
    });

    /**
     * eliminar un contacto
     */
    routerUser.delete('/:id/contacts/:cid', (req, res) => {
        const userId = req.params.id;
        const cid = req.params.cid;
        // lógica para obtener los contactos del usuario con ese id
        res.json({ userId, cid });
    });

     /**
    * Obtener todos los trayectos de un usuario
     * GET /usuarios/:id/trayectos
     */
    routerUser.get('/:id/trayectos', (req, res) => {
        const userId = req.params.id;
        const resp = modelTrayectosInstance.getAll(userId);
        res.json(resp);
    });

    /**
     * Obtener trayecto activo de un usuario
     * GET /usuarios/:id/trayectos/activo
     */
    routerUser.get('/:id/trayectos/activo', (req, res) => {
        const userId = req.params.id;
        const trayectos = modelTrayectosInstance.getAll(userId);
        const activo = trayectos.find(t => t.estado === 'activo') || null;
        res.json(activo);
    });

    /**
     * Crear un nuevo trayecto
     * POST /usuarios/:id/trayectos
     */
    routerUser.post('/:id/trayectos', (req, res) => {
        const userId = req.params.id;
        const datos = req.body;

            console.log("userId:", userId)        // <- agregar
            console.log("datos recibidos:", datos) // <- agregar

        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() + parseInt(datos.tiempo_estimado_min));
        const vence_at = ahora.toISOString().replace('T', ' ').substring(0, 19);

        const datosFinal = {
            ...datos,
            user_id: userId,
            latitud_origen: datos.latitud_origen || null,
            longitud_origen: datos.longitud_origen || null,
            latitud_destino: datos.latitud_destino || null,
            longitud_destino: datos.longitud_destino || null,
            vence_at
        };

        console.log("datosFinal:", datosFinal) // <- agregar

try {
    const resp = modelTrayectosInstance.create(datosFinal);
    const trayectoCreado = modelTrayectosInstance.get(userId, resp.lastInsertRowid);
    res.json(trayectoCreado);
} catch(e) {
    console.log("Error:", e.message)
    res.status(500).json({ error: e.message })
}
    });

    /**
     * Confirmar llegada
     * PATCH /usuarios/:id/trayectos/:tid/confirmar-llegada
     */
    routerUser.patch('/:id/trayectos/:tid/confirmar-llegada', (req, res) => {
        const user_id = req.params.id;
        const id = req.params.tid;
        const confirmado_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const resp = modelTrayectosInstance.put({
            id,
            user_id,
            estado: 'completado',
            confirmado_at
        });
        res.json(resp);
    });

    /**
     * Cancelar trayecto
     * PATCH /usuarios/:id/trayectos/:tid/cancelar
     */
    routerUser.patch('/:id/trayectos/:tid/cancelar', (req, res) => {
        const user_id = req.params.id;
        const id = req.params.tid;
        const cancelado_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const resp = modelTrayectosInstance.put({
            id,
            user_id,
            estado: 'cancelado',
            cancelado_at
        });
        res.json(resp);
    });


    return routerUser;
}

export default getRouterUser;