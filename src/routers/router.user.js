import express from 'express';
import modelUsers from '../models/model.users.js';
import modelContacts from '../models/model.contacts.js'

const getRouterUser = (controllerDB=null) => {
    const modelUsersInstance = modelUsers(controllerDB);
    const modelContactInstance = modelContacts(controllerDB)
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

    return routerUser;
}

export default getRouterUser;