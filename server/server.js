const express = require('express')
const oracledb = require('oracledb');
const sha256 = require('js-sha256');
const cors = require('cors');
const {base64ToBlob} = require("base64-blob");
const app = express();
const port = 3000;
const password = '1234';
let connection;

app.use(cors());
app.use(express.json({limit: '100mb'}));

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
            [newUser.username], {outFormat: oracledb.OUT_FORMAT_OBJECT});
        if (checkUsername.rows[0] !== undefined) {
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
            {outFormat: oracledb.OUT_FORMAT_OBJECT});
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
/*gets profile data by username*/
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
/*saves a single photo to db*/
async function savePhoto(req, res) {
    let result;
    try {
        const newPhoto = req.body;
        newPhoto.image = newPhoto.image.toString();
        const date = new Date(newPhoto.uploadDate);
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `INSERT INTO "SZABO"."PHOTO"(ID_PHOTO, TITLE, DESCRIPTION, UPLOADDATE, OWNER, IMAGE, CURRENTRATING, CATEGORIES, LOCATION)
             VALUES (:id_photo, :title, :description, :uploadDate, :owner, :image, :currentRating, :categories, :location)`,
            [newPhoto.id_photo, newPhoto.title, newPhoto.description, date, newPhoto.owner, newPhoto.image,
                newPhoto.currentRating, newPhoto.categories, newPhoto.location]);
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
/*gets all user photos to profile page*/
async function getPhotos(req, res) {
    let result;
    oracledb.fetchAsString = [ oracledb.CLOB ];
    try {
        console.log('trying to get photos');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT *
             FROM "SZABO"."PHOTO"
             WHERE OWNER = :owner ORDER BY UPLOADDATE DESC`,
            [req.query.owner]);
        console.log('photos reached');
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
/*logs in user if they are in the database*/
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
             WHERE USERNAME = :username
               AND PASSWORD = :password`,
            [userLogin.username, userLogin.password], {outFormat: oracledb.OUT_FORMAT_OBJECT});
        if (result.rows[0]) {
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

app.get('/categories', getCategories);
/* returns all categories */
async function getCategories(req, res) {
    console.log('categories needed');
    let result;
    try {
        console.log('trying to get categories');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT * FROM "SZABO"."CATEGORIES"`);
        console.log('categories reached');
        console.log(result.rows);
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
app.get('/cities', getCities);
/*returns all city names*/
async function getCities(req, res) {
    console.log('city names needed');
    let result;
    try {
        console.log('trying to get cities');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `SELECT NAME FROM "SZABO"."CITIES" WHERE COUNTRY_NAME='Hungary'`);
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

app.post('/city', addCity);
/*adds a new city to cities*/
async function addCity(req, res) {
    let result;
    try {
        const newCity = req.body;
        console.log('adding a new city');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `INSERT INTO "SZABO"."CITIES" (ID_CITY, NAME, ASCII_NAME, COUNTRY_NAME)
             VALUES (:id_city, :name, :ascii_name, :country_name)`,
            [newCity.id_city, newCity.name, newCity.ascii_name, newCity.country_name]);
        await connection.commit();
        res.status(201).json({
            message: "city added"
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
app.post('/category', addCategory);
/*adds a new city to cities*/
async function addCategory(req, res) {
    let result;
    try {
        const newCategory = req.body;
        console.log('adding a new category');
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `INSERT INTO "SZABO"."CATEGORIES" (CATEGORY_NAME)
             VALUES (:category_name)`,
            [newCategory.category_name]);
        await connection.commit();
        res.status(201).json({
            message: "category added"
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

app.post('/removePhoto', removePhoto);
/*adds a new city to cities*/
async function removePhoto(req, res) {
    let result;
    try {
        let photo = req.body;
        const connection = await oracledb.getConnection({
            user: "SZABO",
            password: password,
            connectString: "localhost:1521/xe"
        });
        result = await connection.execute(
            `DELETE FROM "SZABO"."PHOTO" WHERE ID_PHOTO=:id`,
            [photo.idPhoto]);
        await connection.commit();
        res.status(201).json({
            message: "photo deleted successfully"
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

app.listen(port, () => console.log("app listening on port %s", port));