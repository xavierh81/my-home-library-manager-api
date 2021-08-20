// Imports
const validator = require('validator');

// Check if a string parameter is empty 
module.exports.isStringEmpty = (str) => {
    return (!str || /^\s*$/.test(str));
}

// Check if the mail is valid
module.exports.isValidEmail = (str) => {
    return validator.isEmail(str);
}

// Format bytes into a printable string
module.exports.formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i];
}