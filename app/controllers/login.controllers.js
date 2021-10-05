const mongoose = require('mongoose');
const Users = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailer = require('../modules/mailer');
const { generateToken } = require('../utils/generateToken');

const db = mongoose.connection;

exports.REGISTER = async (req, res) => {
    const { email, cpf } = req.body;

    if (await Users.findOne({ email }))
        res.status(400).send({
            code: 400,
            message: 'Email already exists'
        });

    if (await Users.findOne({ cpf }))
        res.status(400).send({
            code: 400,
            message: 'CPF already registered'
        });

    try {
        const user = new Users(req.body);
        const hash = await bcrypt.hash(user.password, 10);

        delete user.password;
        user.password = hash;

        user.save()
            .then(async data => {
                res.status(201).send(
                    {
                        message: 'success',
                        code: 201,
                        token: generateToken({ id: data._id })
                    }
                );
            }).catch(err => {
                res.status(400).send({
                    code: 400,
                    message: 'Registration fail '
                });
            });
    } catch (message) {
        res.status(400).send({
            message: 'Internal Error - register user',
            code: 400
        });
    }
};

exports.AUTHENTICATE = async (req, res) => {
    const { cpf, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ cpf });

        if (!user)
            res.status(404).send({
                code: 404,
                message: 'User not found'
            });

        if (!await bcrypt.compare(password, user.password))
            res.status(404).send({
                code: 404,
                message: 'Invalid password'
            });

        user.password = undefined;

        res.status(200).send(
            {
                message: 'success',
                code: 200,
                data: user,
                token: generateToken({ id: user._id })
            }
        );

    } catch (message) {
        res.status(400).send({
            message: 'Internal Error - authenticate user',
            code: 400
        });
    }
};

exports.FORGOT_PASSWORD = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await db.collection('users').findOne({ email });

        if (!user)
            res.status(404).send({
                code: 404,
                message: 'User not found'
            });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await db.collection('users').findOneAndUpdate({ _id: user._id }, {
            $set: {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'djbarcelos@gmail.com',
            template: 'forgot_password',
            context: { token },
        }, (error) => {
            if (error)
                return res.status(400).send({
                    message: 'Error send mail - ' + error,
                    code: 400
                });

            return res.send();
        })

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - forgot password',
            code: 400
        });
    }
};

exports.RESET_PASSWORD = async (req, res) => {
    const { email, token, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ email })

        if (!user)
            res.status(404).send({
                code: 404,
                message: 'User not found'
            });

        if (token !== user.passwordResetToken)
            res.status(404).send({
                code: 404,
                message: 'Token invalid'
            });

        const now = new Date();

        if (now > user.passwordResetExpires)
            res.status(404).send({
                code: 404,
                message: 'Token expired'
            });

        user.password = await bcrypt.hash(password, 10);

        await db.collection('users').updateOne({ _id: user._id }, { $set: user });

        res.send();

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - reset password',
            code: 400
        });
    }
}

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