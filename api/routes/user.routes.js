const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const indicative = require('indicative').validator;

router.get('/', function (req, res) {
    const db = req.app.locals.db;

    db.collection('users').find().toArray().then(results => {
        res.send(results);
    })
});

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, {
        email: 'required|email',
        firstName: 'required|string|min:2',
        lastName: 'required|string|min:2',
        password: 'required|string|min:6|max:20',
        role: 'required'
    }).then(() => {
        const collection = db.collection('users');

        collection.findOne({email: user.email}).then(existingUser =>{
            if(existingUser){
                res.status(303).json({message: "User with this email already exists"})
            }
            else{
                collection.insertOne(user).then(result => {
                    if(result.result.ok === 1){
                        res.status(201).json({user: user, message: "Created new user"});
                    }
                    else{
                        res.status(500).json({message: "Problem with creating a user."});
                    }
                })
            }
        })
    }).catch(errors => {
        res.status(500).json({errors: errors})
    });
});

// PUT (edit) user by id
/*
router.put('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, {
        id: 'regex:^[0-9a-f]{24}$',
        email: 'required|email',
        fname: 'required|string|min:2',
        lname: 'required|string|min:2',
        password: 'required|string|min:6|max:20',
        role: 'required|integer|above:0|under:4'
    }).then(() => {
        if (user.id !== req.params.userId) {
            error(req, res, 400, `Invalid user data - id in url doesn't match: ${user}`);
            return;
        }
        const collection = db.collection('users');
        user._id = new mongodb.ObjectID(user.id);
        delete (user.id);
        console.log('Updating user:', user);
        collection.updateOne({ _id: new mongodb.ObjectID(user._id) }, { "$set": user })
            .then(result => {
                const resultUser = replaceId(user);
                if (result.result.ok && result.modifiedCount === 1) {
                    res.json(resultUser);
                } else {
                    error(req, res, 400, `Data was NOT modified in database: ${JSON.stringify(user)}`);
                }
            }).catch((err) => {
            error(req, res, 500, `Server error: ${err}`, err);
        })
    }).catch(errors => {
        error(req, res, 400, `Invalid user data: ${util.inspect(errors)}`);
    })
});

// DELETE users list
router.delete('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('users', function (err, users_collection) {
                if (err) throw err;
                users_collection.findOneAndDelete({ _id: new mongodb.ObjectID(params.userId) },
                    (err, result) => {
                        if (err) throw err;
                        if (result.ok) {
                            replaceId(result.value);
                            res.json(result.value);
                        } else {
                            error(req, res, 404, `User with Id=${params.userId} not found.`, err);
                        }
                    });
            });
        }).catch(errors => {
        error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
    });
});
*/


module.exports = router;
