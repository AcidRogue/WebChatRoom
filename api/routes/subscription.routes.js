const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.get('/:userId/:serverId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    if (!params.userId || !params.serverId) {
        res.status(400).json("Request error");
    }

    db.collection('users').findOne({_id: new mongodb.ObjectID(params.userId)}).then(user => {
        if (user) {
            db.collection('servers').findOne({_id: new mongodb.ObjectID(params.serverId)}).then(server => {
                if (server) {
                    db.collection('subscriptions').insertOne({ServerId: server._id, UserId: user._id}).then(r1 => {
                        if (r1.result.ok === 1) {
                            res.status(200).json({status: 1, message: `User ${user.Username} successfully subscribed to ${server.Name}`
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
