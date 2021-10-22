const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const configs = require('./configs/config_server.json');
const cors = require('cors');

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


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes/auth.routes.js')(app);

app.listen(configs['ENV_PORT'], () => {
    console.info(`Server ON`);
});