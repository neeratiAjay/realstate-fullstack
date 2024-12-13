const backupDatabase = require('./backup.js')
const express = require("express")
const path = require("path")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {v4:uuidv4} = require("uuid")

const app = express()

const dbPath = path.join(__dirname,"users.db")
app.use(cors({
    origin: 'https://realstate-fullstack-1.onrender.com', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  }));


app.use(express.json())



let db = null 
const port = 4000

const initializeServer = async()=>{
    try{
        
        if (!fs.existsSync(dbPath)) {
            console.log("Primary database not found. Attempting to restore from the latest backup...");

            // Restore the latest backup
            const backupsDir = path.join(__dirname, "backups");
            if (fs.existsSync(backupsDir)) {
                const backupFiles = fs.readdirSync(backupsDir).filter(file => file.endsWith(".db"));
                if (backupFiles.length > 0) {
                    // Get the most recent backup
                    const latestBackup = backupFiles.sort((a, b) => b.localeCompare(a))[0];
                    const backupPath = path.join(backupsDir, latestBackup);

                    fs.copyFileSync(backupPath, dbPath);
                    console.log(`Database restored from backup: ${latestBackup}`);
                } else {
                    console.error("No backup files found. Starting with a fresh database.");
                }
            } else {
                console.error("Backup directory does not exist. Starting with a fresh database.");
            }
        }







        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        
        backupDatabase()
        setInterval(backupDatabase, 3600000)
        app.listen(port,()=>{
            console.log(`Server Running at http://localhost:${port}/`)
        })
        
    }catch(e){
        console.log(`Db Error ${e.message}`)
        process.exit(1)
    }
}
initializeServer()

process.on('SIGINT', () => {
    console.log('Server is shutting down. Creating final backup...');
    backupDatabase();
    process.exit();
});


const authenticationToken =  (request,response,next)=>{
    const  authHeader = request.headers["authorization"]

    let jwtToken 

    if (authHeader !== undefined){
        jwtToken = authHeader.split(" ")[1]
    }

    if (jwtToken === undefined){
        response.status(401)
        response.send("Invalid JwtToken")
    }else{

        jwt.verify(jwtToken,"MY_SECRET_TOKEN",(err,payload)=>{
         if (err){
            response.status(401)
            response.send("Invalid JwtToken")
         }else{
            request.username = payload.username
            request.userId = payload.userId
            next()
         }
        })
    }


}

// REGISTRATION API 
app.post("/register", async(request,response)=>{
    const {name,username,password} = request.body 
    try{
    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash(password,10)
    const getUser = `SELECT * FROM user WHERE username = '${username}'`
    const dbUser = await db.get(getUser)
    if(dbUser !== undefined){
        response.status(400)
        response.send({error_msg:"username already exists"})
    }else{
        const insertUser = `INSERT INTO user (id,name,username,password)
        VALUES (?,?,?,?);`
        const dbResponse = await db.run(insertUser,[userId,name,username,hashedPassword])
        const newUserId = dbResponse.lastID
        response.send({message:`New User id ${newUserId}`})
    }
}catch(e){
    response.status(500)
    response.send({error_msg:"Server Error"})
}
    
    
})
// Login API 
app.post("/login", async(request,response)=>{
    const {username,password} = request.body 
    
    const getUSer = `SELECT * FROM user WHERE username = '${username}';`
    const dbUser = await db.get(getUSer)
    if(dbUser === undefined){
        response.status(400)
        response.send({error_msg:"Invalid user "})

    }else{
       const isPasswordMatch = await bcrypt.compare(password,dbUser.password)
       if(isPasswordMatch === true){
        const payload = {username:username,userId:dbUser.id}
        const jwtToken = await jwt.sign(payload,"MY_SECRET_TOKEN")
        response.send({jwt_token:jwtToken})
       }else{
        response.status(400)
        response.send({error_msg:"Incorrect Password. Please try again."})
       }
    }
})

// post API customer details add 

app.post ("/customer", authenticationToken, async(request,response)=>{
    const {
        name,
        mobile,
        budget,
        propertyType,
        propertyName,
        location,
        moreInformation,
        date,
      } = request.body
      const {userId} = request
      const customerId = uuidv4()
      const insertQuary = `INSERT INTO customer(id,customer_name,mobile,property_type,
      interested_property,location,budget,more_information,date_time,user_id)
      
      VALUES(?,?,?,?,?,?,?,?,?,?);`

      const dbResponse = await db.run(insertQuary,[customerId,name,mobile,
        propertyType,propertyName,location,budget,moreInformation,date,userId])
    const newCustomerId = dbResponse.lastID
    if (newCustomerId !== undefined){
        response.send("customer details added successfully")
    }else{
        response.status(500)
        response.send({error_msg:"Server Error"})
    }
})

// GET API 
app.get("/customer",authenticationToken,async(request,response)=>{
    const {search_q =""} = request.query
    const {userId} = request 
    const sqlQuary = `SELECT * FROM customer 
    WHERE 
    (customer_name LIKE '%${search_q}%' OR mobile LIKE '%${search_q}%'
     OR property_type LIKE '%${search_q}%' OR interested_property LIKE '%${search_q}%' 
     OR location LIKE '%${search_q}%' OR budget LIKE '%${search_q}%' OR more_information LIKE '%${search_q}%'
     OR date_time LIKE '%${search_q}%') 
    AND
    user_id = '${userId}';`
    const dbResponse = await db.all(sqlQuary)
    response.send(dbResponse)
})

// DELETE API 
app.delete("/customer/:id", authenticationToken,async(request,response)=>{
    const{id} = request.params 
    
    const deleteQuary = `DELETE  FROM customer WHERE id = ?;`
    await db.run(deleteQuary,[id])
    
    response.send("Customer Deleted Successfully")
})

// UPDATE OR PUT API 
app.put("/customer/:id",authenticationToken,async(request,response)=>{
    const{id} = request.params
    const {userId} = request
    const{name,
        mobile,
        budget,
        location,
        moreInformation,
        propertyType,
        propertyName,
        date} = request.body
    try{
        const updateQuary = `UPDATE customer 
        SET customer_name = ?,
        mobile = ?,
        property_type = ?,
        interested_property = ?,
        location = ?,
        budget = ?,
        more_information = ?,
        date_time = ?
        WHERE id = ? AND user_id = ?`
        await db.run(updateQuary,[name,mobile,propertyType,propertyName,location,budget,moreInformation,date,id,userId])
        response.send("Customer Details Updated Successfully")
    }catch(e){
        response.status(500)
        response.send("Server Error")
    }
})



/*
const {userId} = request
    const {id} = request.params
    const{name,
    mobile,
    budget,
    location,
    moreInformation,
    propertyType,
    propertyName,
    date} = request.body
    
   console.log(request)
*/