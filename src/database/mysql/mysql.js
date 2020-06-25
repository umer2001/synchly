const mysql = require('mysql');
const exec = require('./../../utils/await-exec');
const files = require('./../../utils/files');
const path = require('path');
const { promisify } = require('util')

let awaitMysqlConnect = (connection) => {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if(err) {
                reject(err);
                return;
            }
            resolve(connection);
        });
    });
}

let awaitMysqlEnd = (connection) => {
    return new Promise((resolve, reject) => {
        connection.end(function(err) {
            if(err) {
                reject(err);
                return;
            }
            resolve(connection);
        });
    });
}

let connect = async (dbConfig) => {
    
    const connection = mysql.createConnection({
        user: dbConfig.dbAuthUser,
        password: dbConfig.dbAuthPwd,
        host: dbConfig.dbHost,
        port: dbConfig.dbPort,
        database: dbConfig.dbName,
    });

    const connRes = await awaitMysqlConnect(connection);
    const disConnRes = await awaitMysqlEnd(connection);

    return connRes;
}

let dump = async (dbConfig, backupPath) => {

    const mysqlDumpCmd =
    `mysqldump \
    --host=${dbConfig.dbHost} \
    --port=${dbConfig.dbPort} \
    --user=${dbConfig.dbAuthUser} \
    --password=${dbConfig.dbAuthPwd} \
    --databases ${dbConfig.dbName} \
    --compress \
    --routines \
    --result-file=${backupPath}`;

    let dbDump = await exec(mysqlDumpCmd);

    const compressFileRes = await files.compressFile(backupPath);
    return dbDump;
}

module.exports = {
    connect,
    dump
}