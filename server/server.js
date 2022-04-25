const express = require('express')
const oracledb = require('oracledb');
const cors = require('cors');
const app = express();
const port = 3000;
const password = 'devilmaycry4';
let connection;
app.use(cors());
app.use(express.json());
app.post('/register', registerUser);
async function registerUser(req, res){
    let result;
    try {
        console.log('something is happening');
        const newUser = req.body;
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `INSERT INTO "SZABO"."USRS"(USERNAME, PASSWORD, FULL_NAME, EMAIL, LOCATION) 
        VALUES (:username,:password,:fullname,:email,:location)`,
            [newUser.username, newUser.password, newUser.full_name, newUser.email, newUser.location]);
        await connection.commit();
        res.status(201).json({
            message: "user created"
        });
    } catch (err) {
        console.log(err.message)
        return res.send(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                return console.error(err.message);
            }
        }
    }
}
app.get('/profile', getUserProfile);
async function getUserProfile(req, res){
    let result;
    try {
        console.log('something is happening');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT * FROM "SZABO"."USRS" WHERE USERNAME=:username`,
            [req.query.username]);
        console.log('finished');
        res.status(201).json(result.rows);
    } catch (err) {
        console.log(err.message)
        return res.send(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                return console.error(err.message);
            }
        }
    }
}

app.listen(port, () => console.log("app listening on port %s", port));