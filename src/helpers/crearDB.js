import Database from "better-sqlite3";

export function crearDB(){
    const raiz = process.cwd();
    const mydb = `${raiz}/app.db`
    console.log("Ruta de la bd:", mydb)
    const db = new Database(mydb)
    
    // ==========================================
    // 1. TABLA DE USUARIOS (TABLA PADRE)
    // ==========================================
    const query = `CREATE TABLE users(
        id INTEGER PRIMARY KEY,
        name STRING NOT NULL,
        username STRING NOT NULL UNIQUE,
        email STRING NOT NULL UNIQUE,
        password STRING NOT NULL,
        matricula STRING NOT NULL UNIQUE,
        telefono STRING NOT NULL UNIQUE,
        rol STRING NOT NULL DEFAULT 'user',
        mensaje_sos_global STRING DEFAULT '¡Ayuda! Estoy en una emergencia. Esta es mi ubicación actual:'
    )    
    `
    db.exec(query)
    
    const data = [
        {name:"ana",username:"an1",email:"ana@example.com",password:"pass1",matricula:"12345",telefono:"555-1234"},
        {name:"juan",username:"ju2",email:"juan@example.com",password:"pass2",matricula:"67890",telefono:"555-5678"},
        {name:"bety",username:"be3",email:"bety@example.com",password:"pass3",matricula:"54321",telefono:"555-9012"},
        {name:"paco",username:"pa0",email:"paco@example.com",password:"pass0",matricula:"09876",telefono:"555-3456"},
        {name:"luis",username:"lu5",email:"luis@example.com",password:"pass5",matricula:"11111",telefono:"555-7890"}
    ]

    const insertData = db.prepare(`insert into users(name,username,email,password,matricula,telefono) values(?,?,?,?,?,?)`)
    
    data.forEach(user => {
        const r = insertData.run(user.name, user.username, user.email, user.password, user.matricula, user.telefono)
        console.log("Usuario creado:", r.lastInsertRowid)
    })

    // ==========================================
    // 2. TABLA DE CONTACTOS DE EMERGENCIA
    // ==========================================
    const queryContact = `CREATE TABLE contacts(
        id INTEGER PRIMARY KEY,
        name STRING NOT NULL,
        telefono STRING NOT NULL,
        message STRING DEFAULT '',
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(telefono, user_id) -- Evita contactos duplicados por usuario
    )    
    `
    db.exec(queryContact)

    const dataContact = [
        {name:"maria",telefono:"555-4321",user_id:1},
        {name:"pedro",telefono:"555-8765",user_id:2},
        {name:"laura",telefono:"555-2468",user_id:3},
        {name:"Mamá", telefono:"555-0000", user_id:4}, 
        {name:"Mamá", telefono:"555-0000", user_id:5}
    ]
    const insertDataContact = db.prepare(`insert into contacts(name,telefono,user_id) values(?,?,?)`)
    
    dataContact.forEach(contact => {
        const r = insertDataContact.run(contact.name, contact.telefono, contact.user_id)
        console.log("Contacto creado:", r.lastInsertRowid)
    })

    // ==========================================
    // 3. TABLA DE TRAYECTOS (NIVEL 1 - PREVENCIÓN)
    // ==========================================
    const queryTrayectos = `CREATE TABLE IF NOT EXISTS trayectos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        destino TEXT NOT NULL,
        latitud_origen REAL,
        longitud_origen REAL,
        latitud_destino REAL,
        longitud_destino REAL,
        tiempo_estimado_min INTEGER NOT NULL,
        tipo_acompanamiento TEXT NOT NULL DEFAULT 'sin_acompanamiento',
        estado TEXT NOT NULL DEFAULT 'activo',
        iniciado_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')), -- Registra hora local del sistema
        vence_at TEXT NOT NULL,
        confirmado_at TEXT,
        cancelado_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `
    db.exec(queryTrayectos)

    // Datos dummy para testear el historial o el estado de trayectos activos
    const dataTrayectos = [
        {
            user_id: 1, 
            destino: "Biblioteca Central", 
            lat_orig: 19.4326, lon_orig: -99.1332, 
            lat_dest: 19.4335, lon_dest: -99.1345, 
            tiempo: 15, 
            acompanamiento: "virtual", 
            estado: "completado", 
            vence: "2026-06-03 20:45:00"
        },
        {
            user_id: 2, 
            destino: "Estacionamiento Sur", 
            lat_orig: 19.4310, lon_orig: -99.1310, 
            lat_dest: 19.4390, lon_dest: -99.1380, 
            tiempo: 10, 
            acompanamiento: "fisico", 
            estado: "activo", 
            vence: "2026-06-03 21:00:00"
        }
    ]

    const insertDataTrayectos = db.prepare(`
        INSERT INTO trayectos (
            user_id, destino, latitud_origen, longitud_origen, 
            latitud_destino, longitud_destino, tiempo_estimado_min, 
            tipo_acompanamiento, estado, vence_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    dataTrayectos.forEach(trayecto => {
        const r = insertDataTrayectos.run(
            trayecto.user_id, 
            trayecto.destino, 
            trayecto.lat_orig, 
            trayecto.lon_orig, 
            trayecto.lat_dest, 
            trayecto.lon_dest, 
            trayecto.tiempo, 
            trayecto.acompanamiento, 
            trayecto.estado, 
            trayecto.vence
        )
        console.log("Trayecto inicial creado:", r.lastInsertRowid)
    })

    db.close()
}

crearDB();