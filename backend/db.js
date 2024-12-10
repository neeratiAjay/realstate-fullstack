const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./users.db",(err)=>{
 if (err){
    console.log(`Db Initialize Error : ${e.message}`)
 }else{
    console.log(" DB initialized successfully")
 }
})

db.serialize(()=>{

    db.run(`CREATE TABLE  IF NOT EXISTS user(
        id TEXT PRIMARY KEY NOT NULL,
        name VARCHAR(250),
        username VARCHAR(250),
        password TEXT)`);

    db.run(`CREATE TABLE IF NOT EXISTS customer(
        id TEXT PRIMARY KEY NOT NULL,
        customer_name VARCHAR(250),
        mobile VARCHAR(12),
        property_type VARCHAR(200),
        interested_property VARCHAR(250),
        location TEXT,
        budget VARCHAR(50),
        more_information TEXT,
        date_time DATETIME,
        user_id TEXT,
        FOREIGN KEY (user_id) REFERENCES user(id))`);
    //db.run(`DROP TABLE customer`)
        
      
});