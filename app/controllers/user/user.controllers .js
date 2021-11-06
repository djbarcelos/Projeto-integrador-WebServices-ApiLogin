const mongoose = require('mongoose');
const Users = require('../../models/user');

const ObjectID = require("mongodb").ObjectID
const db = mongoose.connection;

exports.USERONE = async (req, res) => {

    try {

        const user = await db.collection('users').findOne({ cpf: req.query.cpf });

        if (user) {

            delete user.password;
            res.status(200).send(
                {
                    code: 200,
                    message: 'success',
                    data: user
                }
            );
        } else {
            res.status(404).send({
                code: 404,
                message: 'Not Found'
            });
        }
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error',
            code: 500
        });
    }

};

exports.USERS = async (req, res) => {
    try {

        let users = await db.collection('users').find().toArray();

        if (users) {
            users.map(e => { delete e.password; return e; });
            res.status(200).send(
                {
                    user: req.userId,
                    message: 'success',
                    code: 200,
                    data: users
                }
            );
        } else {
            res.status(404).send({
                code: 404,
                message: 'Not Found'
            });
        }

    } catch (message) {
        res.status(500).send({
            message: 'Internal Server Error',
            code: 500
        });
    }
};

exports.UPDATEUSER = async (req, res) => {
    const userdata = req.body;
    try {

        const user = await db.collection('users').findOne({ _id: ObjectID(userdata.id) });

        if (!user)
            res.status(404).send({
                code: 404,
                message: 'Not Found'
            });

        delete userdata.id;
        delete userdata.password;

        await db.collection('users').updateOne({ _id: user._id }, { $set: userdata });


        res.status(200).send(
            {
                message: 'success',
                code: 200,
            }
        );

    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error',
            code: 500
        });
    }
};

exports.REGISTERMYCALLS = async (req, res) => {
    const { specialty, date, schedule } = req.body
    try {

        const user = await Users.findOne({ _id: req.userId });

        if (!user)
            res.send({
                code: 400,
                connection: false,
                message: 'Problems finding user'
            });


        user.myCalls.push({
            specialty,
            date,
            schedule,
            states: {
                state: 'scheduled',
            },
            createdAt: new Date()
        });

        await Users.findByIdAndUpdate(req.userId, user, { new: true });

        res.send({
            code: 200,
            message: 'success'
        });

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - register my calls',
            code: 400
        });
    }
};

exports.MYCALLS = async (req, res) => {
    try {

        const user = await Users.findOne({ _id: req.userId });

        if (!user)
            res.send({
                code: 400,
                connection: false,
                message: 'Problems finding user'
            });

        let updateBD = false;
        user.myCalls.map(e => {

            const currentDate = new Date();

            if (e.date <= currentDate && e.states.state === 'scheduled') {
                e.states.state = 'accomplished';
                updateBD = true;
            }

            return e;
        });

        if (updateBD)
            await Users.findByIdAndUpdate(req.userId, user, { new: true });

        res.send({
            code: 200,
            message: 'success',
            data: user.myCalls
        });

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - register my calls',
            code: 400
        });
    }
};

exports.MARKOFF = async (req, res) => {
    const { queryId } = req.body;
    try {
        const user = await Users.findOne({ _id: req.userId });

        if (!user)
            res.send({
                code: 400,
                connection: false,
                message: 'Problems finding user'
            });

        const indice = user.myCalls.findIndex(e => e._id.toString() === queryId);

        if (indice === -1)
            res.send({
                code: 400,
                connection: false,
                message: 'Problems finding the query'
            });

        user.myCalls[indice].states.state = 'calledoff';
        user.myCalls[indice].calledoffLog = new Date();

        await Users.findByIdAndUpdate(req.userId, user, { new: true });

        res.send({
            code: 200,
            message: 'success',
        });

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - register my calls',
            code: 400
        });
    }
};