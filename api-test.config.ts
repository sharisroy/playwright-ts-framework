
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

export { config };