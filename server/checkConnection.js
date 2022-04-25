const oracledb = require('oracledb');

async function checkConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "SZABO",
            password: 'devilmaycry4',
            connectString: "localhost:1521/xe"
        });
        const result = await connection.execute('SELECT * FROM USRS');
        console.log(result.rows);
        console.log('connected to database');
    } catch (err) {
        console.error(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('connection closed');
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}

checkConnection();