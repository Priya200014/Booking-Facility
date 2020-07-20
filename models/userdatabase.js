const getdb = require('../utils/database').getDb;
const mongodb = require('mongodb');

class UserData {

    constructor(n, p, e) {
        this.user = n;
        this.pass = p;
        this.email = e;
        this.tickets = [];
        this.resetToken = null;
    }

    save() {

        const db = getdb();

        return db.collection('user')
            .insertOne(this)
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
    }

    static fetchByName(email) {

        const db = getdb();
        console.log("userId");
        console.log(email);
        return db.collection('user').findOne({
                email: email
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static booking(email, obj) {

        const db = getdb();
        console.log("Add Ticket");
        console.log(obj);
        return db.collection('user').updateOne({
                email: email
            }, {
                $push: {
                    tickets: obj
                }
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}


module.exports = UserData;