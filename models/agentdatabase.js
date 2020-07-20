const getdb = require('../utils/database').getDb;
const mongodb = require('mongodb');

class AgentData {

    constructor(n, p, e) {
        this.user = n;
        this.pass = p;
        this.email = e;
        this.bus = [];
        this.resetToken = null;
    }

    save() {

        const db = getdb();

        return db.collection('agent')
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
        return db.collection('agent').findOne({
                email: email
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static addBus(email, obj) {

        const db = getdb();
        console.log("Add bus");
        console.log(obj);
        return db.collection('agent').updateOne({
                email: email
            }, {
                $push: {
                    bus: obj
                }
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static addSchedule(email, travel, obj) {

        const db = getdb();
        console.log("Add bus");
        console.log(obj);
        return db.collection('agent').updateOne({
                email: email,
                "bus.name": travel
            }, {
                $push: {
                    "bus.$.schedule": obj
                }
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static updateSchedule(email, tid, id, obj) {

        const db = getdb();
        console.log("Update bus");
        let val = "bus." + tid + ".schedule." + id;
        console.log(obj);
        return db.collection('agent').updateOne({
                email: email
            }, {
                $set: {
                    [val + ""]: obj
                }
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static fetchBus(from, to) {

        const db = getdb();
        console.log(from);
        console.log(to);
        return db.collection('agent').find({
                bus: {
                    "$elemMatch": {
                        schedule: {
                            "$elemMatch": {
                                from: from,
                                to: to
                            }
                        }
                    }
                }
            })
            .toArray()
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    }

    static booking(email, tid, id, obj) {

        console.log("Update Booking");
        console.log(email);
        console.log(tid);
        console.log(id);
        console.log(obj);
        const db = getdb();
        let val = "bus." + tid + ".schedule." + id + ".bookedseats";
        console.log(obj);
        return db.collection('agent').updateMany({
                email: email
            }, {
                $push: {
                    [val + ""]: {
                        $each: [...obj]
                    }
                }
            })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}


module.exports = AgentData;