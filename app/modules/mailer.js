const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../configs/consfig_mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
});

transport.use('compile', hbs({
    viewEngine:  {
        extName: ".html",
        partialsDir: path.resolve('./app/resources/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve("./app/resources/mail/"),
    extName: '.html',
}));

module.exports = transport;