import Database from "better-sqlite3";

export function crearDB(){
    const raiz= process.cwd();
    const mydb=`${raiz}/app.db`
    console.log("Ruta de la bd:",mydb)
    const db = new Database(mydb)
    
    const query=`CREATE TABLE users(
        id INTEGER PRIMARY KEY,
        name STRING NOT NULL,
        username STRING NOT NULL UNIQUE,
        email STRING NOT NULL UNIQUE,
        password STRING NOT NULL,
        matricula STRING NOT NULL UNIQUE,
        telefono STRING NOT NULL UNIQUE,
        rol STRING NOT NULL DEFAULT 'user'
    )    
    `
    db.exec(query)
    
    const data=[
        {name:"ana",username:"an1",email:"ana@example.com",password:"pass1",matricula:"12345",telefono:"555-1234"},
        {name:"juan",username:"ju2",email:"juan@example.com",password:"pass2",matricula:"67890",telefono:"555-5678"},
        {name:"bety",username:"be3",email:"bety@example.com",password:"pass3",matricula:"54321",telefono:"555-9012"},
        {name:"paco",username:"pa0",email:"paco@example.com",password:"pass0",matricula:"09876",telefono:"555-3456"},
        {name:"luis",username:"lu5",email:"luis@example.com",password:"pass5",matricula:"11111",telefono:"555-7890"}
    ]
    //Usar `?` en la consulta y pasar los valores como argumentos a `run()` 
    //previene automáticamente los ataques de inyección SQL
    const insertData=db.prepare(`insert into users(name,username,email,password,matricula,telefono) values(?,?,?,?,?,?)`)
    
    data.forEach(user=>{
        const r=insertData.run(user.name, user.username, user.email, user.password, user.matricula, user.telefono)
        console.log(r)
    })

    const queryContact=`CREATE TABLE contacts(
        id INTEGER PRIMARY KEY,
        name STRING NOT NULL,
        email STRING NOT NULL UNIQUE,
        telefono STRING NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )    
    `
    db.exec(queryContact)

    const dataContact=[
        {name:"maria",email:"maria@example.com",telefono:"555-4321",user_id:1},
        {name:"pedro",email:"pedro@example.com",telefono:"555-8765",user_id:2},
        {name:"laura",email:"laura@example.com",telefono:"555-2468",user_id:3}
    ]
    const insertDataContact=db.prepare(`insert into contacts(name,email,telefono,user_id) values(?,?,?,?)`)
    
    dataContact.forEach(contact=>{
        const r=insertDataContact.run(contact.name, contact.email, contact.telefono, contact.user_id)
        console.log(r)
    })

    db.close()
}