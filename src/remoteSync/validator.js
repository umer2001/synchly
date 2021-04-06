const files = require('./../utils/files');
const gDriveValidator = require('./gDrive/validator');
const sftpValidator = require('./sftp/validator');
const s3Validator = require('./s3/validator');

const remoteConfigKeys = {
    remoteType: 'remoteType',
};

const validateInitConfig = async (config) => {
    let validatedConfig = {};

    if (!config[remoteConfigKeys.remoteType]) {
        throw new Error(`Invalid config: Missing required field - '${remoteConfigKeys.remoteType}'`);
    }
    if (!['Google Drive', 'SFTP', 'S3'].includes(config[remoteConfigKeys.remoteType])) {
        throw new Error(
            `Invalid config: Unrecognised '${remoteConfigKeys.remoteType}' - ${config[remoteConfigKeys.remoteType]}`
        );
    }
    validatedConfig.remoteType = config[remoteConfigKeys.remoteType];

    if (validatedConfig.remoteType == 'Google Drive') {
        let gDriveValidatedConfig = await gDriveValidator.validateInitConfig(config);
        validatedConfig = Object.assign(validatedConfig, gDriveValidatedConfig);
    } else if (validatedConfig.remoteType == 'SFTP') {
        let sftpValidatedConfig = await sftpValidator.validateInitConfig(config);
        validatedConfig = Object.assign(validatedConfig, sftpValidatedConfig);
    } else if (validatedConfig.remoteType == 'S3') {
        let s3ValidatedConfig = await s3Validator.validateInitConfig(config);
        validatedConfig = Object.assign(validatedConfig, s3ValidatedConfig);
    }

    return validatedConfig;
};

module.exports = {
    validateInitConfig,
};
