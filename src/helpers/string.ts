// Imports
import validator from 'validator';

// Check if a string parameter is empty 
export const isStringEmpty = (str: string | null) : boolean => {
    return (!str || /^\s*$/.test(str));
}

// Check if the field contains not allowed characters 
export const isValidString = (str: string | null) : boolean => {
    return (!str || /^[a-zA-Z \-\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F]+$/.test(str));
}

// Check if the mail is valid
export const isValidEmail = (str: string | null) : boolean => {
    if(str == null) return false;
    
    return validator.isEmail(str);
}

// Format bytes into a printable string
export const formatBytes = (bytes: number, decimals = 2) : string => {
    if (bytes === 0) return '0B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i];
}