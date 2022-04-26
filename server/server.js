const express = require('express')
const oracledb = require('oracledb');
const sha256 = require('js-sha256');
const cors = require('cors');
const app = express();
const port = 3000;
const password = 'devilmaycry4';
let connection;
app.use(cors());
app.use(express.json());

app.post('/register', registerUser);
/* register user with taken username check */
async function registerUser(req, res) {
    let result;
    try {
        const newUser = req.body;
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        newUser.password = sha256(newUser.password);
        /* check if username is taken */
        let checkUsername = result = await connection.execute(
            `SELECT *
             FROM "SZABO"."USRS"
             WHERE USERNAME = :username`,
            [newUser.username], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if(checkUsername.rows[0] !== undefined) {
            console.log('username taken');
            res.status(201).json({
                message: "user taken"
            });
            return;
        }
        result = await connection.execute(
            `INSERT INTO "SZABO"."USRS"(USERNAME, PASSWORD, FULL_NAME, EMAIL, LOCATION)
             VALUES (:username, :password, :fullname, :email, :location)`,
            [newUser.username, newUser.password, newUser.full_name, newUser.email, newUser.location],
            { outFormat: oracledb.OUT_FORMAT_OBJECT } );
        console.log(result.rows);
        await connection.commit();
        console.log('new user created');
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
/*get profile data by username*/
async function getUserProfile(req, res) {
    let result;
    try {
        console.log('profile checking');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT *
             FROM "SZABO"."USRS"
             WHERE USERNAME = :username`,
            [req.query.username], {outFormat: oracledb.OUT_FORMAT_OBJECT});
        console.log('Got user profile!');
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

app.post('/photo', savePhoto);
async function savePhoto(req, res) {
    let result;
    try {
        const newPhoto = req.body;
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `INSERT INTO "SZABO"."PHOTO"(ID_PHOTO, TITLE, DESCRIPTION, UPLOADDATE, OWNER, IMAGE, CURRENTRATING,
                                         CATEGORIES, LOCATION)
             VALUES (:id_photo, :title, :description, :uploaddate, :owner, :image, :currentrating, :categories,
                     :location)`,
            [newPhoto.idphoto, newPhoto.title, newPhoto.description, newPhoto.uploaddate, newPhoto.owner, newPhoto.image, newPhoto.currentrating, newPhoto.categories, newPhoto.location]);
        await connection.commit();
        res.status(201).json({
            message: "photo saved"
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

app.get('/photos', getPhotos);
async function getPhotos() {
    let result;
    try {
        console.log('something is happening');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT *
             FROM "SZABO"."PHOTO"
             WHERE OWNER = :idphoto`,
            [req.query.owner]);
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

app.post('/login', loginUser);
async function loginUser(req, res) {
    console.log('a user wants to login');
    let result;
    try {
        const userLogin = req.body;
        userLogin.password = sha256(userLogin.password.toString());
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT *
             FROM "SZABO"."USRS"
             WHERE USERNAME = :username AND PASSWORD = :password`,
            [userLogin.username, userLogin.password], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if(result.rows[0]){
            console.log('user authenticated');
            res.status(201).json({
                message: 'user authenticated',
            });
        } else {
            console.log('error during login');
            res.status(201).json({
                message: "error during login"
            })
        }
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