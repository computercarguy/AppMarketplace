const env = process.env.NODE_ENV.trim();

try {
    switch(env) {
        case 'development':
            require('dotenv').config({path: `${__dirname}/.env.development`});
            break;
        case 'production':
            require('dotenv').config({path: `${__dirname}/.env.production`});
            break;
        case 'undefined':
            Error('Environment undefined, if local in terminal: export NODE_ENV=development');
            break;
        default:
            Error('Unrecognized Environment');
    }  
} catch (err) {
    Error('Error trying to run file');
}
