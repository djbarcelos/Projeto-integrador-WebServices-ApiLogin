
const Login = require('../controllers/login.controllers');
const authMiddleware = require('../controllers/middleware/auth');
// const cors = require('../controllers/middleware/cors');

module.exports = app => {

    app.post('/register', Login.REGISTER);
    app.post('/authenticate', Login.AUTHENTICATE);
    app.post('/forgot_password', Login.FORGOT_PASSWORD);
    app.post('/reset_password', Login.RESET_PASSWORD);

    app.use(authMiddleware);

    app.get('/userOne', Login.USERONE);
    app.get('/users', Login.USERS);
}