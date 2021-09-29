
let mysql = require("mysql");

let express = require("express");
let cors = require("cors");
const { RSA_NO_PADDING } = require("constants");
let app = express();

app.use(cors({
    origin:"*"
}))
app.use(express.urlencoded({
    extended: true
  }));

app.use(express.json());


let PORT = process.env.PORT | 3000;
let sql = mysql.createConnection({
    host:"sql6.freesqldatabase.com",
    user:"sql6441085",
    password:"gcaaSfiK4q",
    database:"sql6441085",
    port:3306,
        
        
    })
sql.connect(function (err){
    if(err){
        console.log(err);
    } else{
        console.log("server connected to database.")
        
    }
})

// sql.query("delete from employeeInfo")


function createNewUser(req,res,id,name,email,gender,jobType,salary){
    sql.query("insert into employeeInfo(id,name,email,gender,jobType,salary) values(?,?,?,?,?,?);",[id,name,email,gender,jobType,salary],function (err,results,field){
        if(err){
            res.statusCode(400);
            res.send("0");
        } else{
            res.send("1")
        }
    })

}

function updateTheUser(req,res,id,name,email,gender,jobType,salary){
    sql.query("update employeeInfo set name=?,email=?,gender=?,jobType=?,salary=? where id=?",[id,name,email,gender,jobType,salary,id],function(err,result,field){
        if(result.affectedRows==0){
            console.log(result);
            res.status(404);
            res.send("0");
        } else{
            res.send("1");
        }
    })
}

// get all employee details from database
app.get("/employee",(req,res)=>{
    sql.query("select * from employeeInfo",function (err,result,field){
        res.send(result);
    })
})

// create new data to database
app.post("/employee",function (req,res){
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let gender = req.body.gender;
    let jobType = req.body.jobType;
    let salary = req.body.salary;
    // console.log("the id is:",req.body)
    // checks whether data already exists are not?
    sql.query("select id from employeeInfo where id=?",[id],function(err,result,field){
        
        if(result.length == 0){
            // sql.end()
            createNewUser(req,res,id,name,email,gender,jobType,salary)
            console.log("came")
            
        } else{
            res.send("0");
            // uploading this data to database
        }
    })
    
})

// update the specified data in the database
app.put("/employee",function(req,res){
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let gender = req.body.gender;
    let jobType = req.body.jobType;
    let salary = req.body.salary;
    sql.query("select id from employeeInfo where id=?",id,function(err,result,field){
        
        if(result.length == 0){
            // sql.end()
            res.status(404)
            res.send("0");
            console.log("no data found")
        } else{
            updateTheUser(req,res,id,name,email,gender,jobType,salary)
            console.log("put data found")
        }
    })
    
})

// delete the specified in the database
app.delete("/employee",function (req,res){
    let id = req.query.id;
    
    sql.query("delete from employeeInfo where id=?",id,function (err,result,field){
        if(err || result.affectedRows == 0){
            console.log("no data match");
            res.status(404);
            res.send("0");

        } else{
            res.send("1");
            console.log("came")
            // console.log(result.affectedRows)
        }
    })
})

app.listen(PORT,function(){
    console.log(`server started listening at ${PORT}`);
})