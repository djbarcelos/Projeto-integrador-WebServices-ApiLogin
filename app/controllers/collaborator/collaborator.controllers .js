const mongoose = require('mongoose');
const Collaborator = require('../../models/collaborator');
const User = require('../../models/user');

const ObjectID = require("mongodb").ObjectID

const db = mongoose.connection;

exports.REGISTERCOLLABORATOR = async (req, res) => {
    const { user } = req.body;

    if (await Collaborator.findOne({ user }))
        res.status(400).send({
            code: 400,
            message: 'Collaborator already registered'
        });

    try {
        const collaborator = new Collaborator(req.body);

        const userRecord = await User.findOne({ _id: user });
        userRecord.permission = 'collaborator';
        await User.findByIdAndUpdate(user, userRecord, { new: true });

        collaborator.save()
            .then(async data => {
                res.status(201).send(
                    {
                        message: 'success',
                        code: 201,
                    }
                );
            }).catch(err => {
                res.status(400).send({
                    code: 400,
                    message: 'Registration fail '
                });
            });

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - register collaborator',
            code: 400
        });
    }
};

exports.COLLABORATORS = async (req, res) => {

    try {

        const collaborators = await db.collection('collaborators').find().toArray();

        const arrayData = [];
        for (const coll of collaborators) {
            const user = await db.collection('users').findOne({ _id: coll.user });

            delete user.password;
            delete user.passwordResetExpires;
            delete user.passwordResetToken;

            if (user)
                coll.user = user;
            else
                coll.user = null;

            arrayData.push(coll);
        }

        res.status(200).send(
            {
                message: 'success',
                code: 200,
                data: arrayData
            }
        );

    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - list collaborators',
            code: 400
        });
    }
};

exports.REMOVECOLLABORATOR = async (req, res) => {
    const { id } = req.body;
    try {

        const collaborator = await db.collection('collaborators').findOne({ _id: ObjectID(id) });
        const userid = collaborator.user;

        const userRecord = await User.findOne({ _id: ObjectID(userid) });
        if (userRecord.permission !== 'common') {
            userRecord.permission = 'common';
            await User.findByIdAndUpdate(userid, userRecord, { new: true });
        }

        await Collaborator.findByIdAndRemove(id)
            .then(data => {
                res.status(200).send(
                    {
                        message: 'success',
                        code: 200,
                    }
                );
            }).catch(err => {
                res.status(400).send({
                    code: 400,
                    message: 'remove fail '
                });
            });


    } catch (error) {
        res.status(400).send({
            message: 'Internal Error - remove collaborators',
            code: 400
        });
    }
};