
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });


const processENV = process.env.TEST_ENV
const env = processENV || 'staging';
console.log(`Running tests in ${env} environment`);

const config = {
    apiBaseUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'learnerharisbd@gmail.com',
    userPassword: 'H12345bd'
};

if (env === 'qa') {
    config.userEmail = 'learnerharisbd@gmail.com';
    config.userPassword = 'H12345bd';
}
if (env === 'staging') {
    config.userEmail = 'learnerharisbd@gmail.com';
    config.userPassword = 'H12345bd';
}
if (env === 'prod') {
    if(!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD){
        throw new Error("Missing Environment variables for production environment");
    }
    config.userEmail = process.env.PROD_USERNAME;
    config.userPassword = process.env.PROD_PASSWORD;
}

export { config };