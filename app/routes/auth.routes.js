
const Login = require('../controllers/login.controllers');
const authMiddleware = require('../controllers/middleware/auth');
const permissionAuthMiddleware = require('../controllers/middleware/ permission_auth');

const User = require('../controllers/user/user.controllers ');
const Collaborator = require('../controllers/collaborator/collaborator.controllers ');

module.exports = app => {

    app.post('/register', Login.REGISTER);
    app.post('/authenticate', Login.AUTHENTICATE);
    app.post('/forgot_password', Login.FORGOT_PASSWORD);
    app.post('/reset_password', Login.RESET_PASSWORD);

    app.use(authMiddleware);
    app.post('/auth', Login.AUTH);

    app.get('/users', User.USERS);
    app.get('/userOne', User.USERONE);
    app.put('/update_user', User.UPDATEUSER);

    app.get('/mycalls', User.MYCALLS);
    app.put('/register_mycalls', User.REGISTERMYCALLS);
    app.put('/mark_off', User.MARKOFF);

    app.use(permissionAuthMiddleware);
    app.post('/register_collaborator', Collaborator.REGISTERCOLLABORATOR);
    app.get('/collaborators', Collaborator.COLLABORATORS);
    app.delete('/remove_collaborator', Collaborator.REMOVECOLLABORATOR);
}