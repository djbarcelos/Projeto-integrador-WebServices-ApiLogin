module.exports = (req, res, next) => {

    if (req.userPermission === 'collaborator' || req.userPermission === 'master')
        return next();

    return res.status(401).send({
        code: 401,
        message: 'Invalid permission'
    });
}