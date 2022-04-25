const express = require('express')
const oracledb = require('oracledb');
const app = express();
const port = 3000;
const password = 'devilmaycry4';
let connection;
let result;

async function selectAllUsers(req, res) {
    try {
        let connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        console.log('sikeres csatlakozas az adatbazishoz');
        result = await connection.execute(`SELECT * FROM USRS`);
    } catch (err) {
        return res.send(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('sikeres kilepes');
            } catch (err) {
                console.error(err.message);
            }
        }
        if (result.rows.length == 0) {
            return res.send('nincsenek sorok');
        } else {
            return res.send(result.rows);
        }

    }
}

app.get('/users', function (req, res) {
    selectAllUsers(req, res);
})

async function selectEmployeesById(req, res, id) {
    try {
        connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(`SELECT * FROM USRS where username=:id`, [id]);

    } catch (err) {
        return res.send(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                return console.error(err.message);
            }
        }
        if (result.rows.length === 0) {
            return res.send('nincsenek eredmeny sorok');
        } else {
            return res.send(result.rows);
        }
    }
}

app.get('/users', function (req, res) {
    let id = req.query.id;
    if (isNaN(id)) {
        res.send('Query param id is not number')
        return
    }
    selectUsersById(req, res, id);
})

app.listen(port, () => console.log("app listening on port %s!", port))