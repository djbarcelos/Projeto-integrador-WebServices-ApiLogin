const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const configs = require('./configs/config_server.json');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json')
const app = express();


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/medicpass', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.info('Database connected successfully');
}).catch(err => {
    console.error(err);
    process.exit();
});

app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'x-access-token');
    next();
});

require('./routes/auth.routes.js')(app);

app.listen(configs['ENV_PORT'], () => {
    console.info(`Server ON`);
});