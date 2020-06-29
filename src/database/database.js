const constants = require('./../utils/constants');
const strings = require('./../utils/strings');
const configstore = require('conf');
const mongoDb = require('./mongoDb/mongoDb');
const mysql = require('./mysql/mysql');

const confStore = new configstore();

const setupConfig = async (isDebug) => {
    const inquirer = require('./inquirer');
    try {
        const config = await inquirer.askConfig();
        config.dbSetupComplete = true;
        confStore.set(config);
        console.log('Database configuration updated successfully.');

        return config;
    } catch (err) {
        console.error('Database configuration update failed.');
        console.error(`${err.name}: ${err.message}`);
        console.error('Re run with --config db to finish the configuration');
        if (isDebug) {
            console.error('Stacktrace:');
            console.error(err);
        } else {
            console.error(strings.debugModeDesc);
        }
    }
};

let connect = async (dbConfig) => {
    let resp;
    if (dbConfig.dbType == 'MongoDB') {
        resp = await mongoDb.connect(dbConfig);
    } else if (dbConfig.dbType == 'MySQL') {
        resp = await mysql.connect(dbConfig);
    }
    return resp;
};

let dump = async (backupDirName) => {
    const dbType = confStore.get('dbType');
    const configObj = confStore.store;

    let resp;
    if (dbType == 'MongoDB') {
        resp = await mongoDb.dump(configObj, backupDirName);
    } else if (dbType == 'MySQL') {
        resp = await mysql.dump(configObj, backupDirName);
    }
    return resp;
};

module.exports = {
    setupConfig,
    connect,
    dump,
};
