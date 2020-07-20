const AgentData = require("../models/agentdatabase");
const UserData = require('../models/userdatabase');

exports.busdisplay = (req, res, next) => {

    AgentData.fetchBus(req.body.from, req.body.to).then(result => {

        console.log("Bus date");

        return new Promise(function (resolve, reject) {

            let data = [];
            let i = 0;
            for (let entry of result) {
                let j = 0;
                for (let each_bus of entry.bus) {
                    let k = 0
                    for (let each_schedule of each_bus.schedule) {

                        if ((each_schedule.from == req.body.from) && (each_schedule.to == req.body.to)) {

                            let d1 = new Date(each_schedule.start_date);
                            let d2 = new Date(req.body.date);
                            if ((d1.getMonth() > d2.getMonth()) && (d1.getFullYear() >= d2.getFullYear())) data.push({
                                agent: entry.email,
                                travel: each_bus.name,
                                tid: j,
                                id: k,
                                data: each_schedule
                            });
                            else if ((d1.getMonth() == d2.getMonth()) && (d1.getDate() >= d2.getDate()) && (d1.getFullYear() >= d2.getFullYear())) data.push({
                                agent: entry.email,
                                travel: each_bus.name,
                                tid: j,
                                id: k,
                                data: each_schedule
                            });
                            else if ((d1.getMonth() == d2.getMonth()) && (d1.getDate() < d2.getDate()) && (d1.getFullYear() > d2.getFullYear())) data.push({
                                agent: entry.email,
                                travel: each_bus.name,
                                tid: j,
                                id: k,
                                data: each_schedule
                            });
                            else if ((d1.getMonth() < d2.getMonth()) && (d1.getFullYear() > d2.getFullYear())) data.push({
                                agent: entry.email,
                                travel: each_bus.name,
                                tid: j,
                                id: k,
                                data: each_schedule
                            });
                        }
                        k++;
                    }
                    j++;
                }
                i++;
            }

            if (i >= result.length) {

                console.log(data);
                console.log("resolve");
                return resolve(data);
            }
        })
    }).then(data => {

        console.log(data);
        res.render("busdisplay.ejs", {
            details: data
        });
    }).catch(err => console.log(err));
}

exports.seatselection = (req, res, next) => {

    AgentData.fetchByName(req.params.agent).then(result => {

        let id = req.params.id;
        let tid = req.params.tid;
        console.log("bus seat");
        console.log(result.bus[tid + ""].schedule[id + ""].bookedseats);
        res.render("seatselection.ejs", {
            booked: result.bus[tid + ""].schedule[id + ""].bookedseats,
            agent: req.params.agent,
            tid: tid,
            id: id,
            fc: result.bus[tid + ""].schedule[id + ""].fc_amount,
            ec: result.bus[tid + ""].schedule[id + ""].ec_amount
        });
    }).catch(err => console.log(err));
}

exports.booking = (req, res, next) => {

    let agent = req.body.agent;
    let tid = req.body.tid;
    let id = req.body.id;
    let price;
    let agentdata;
    let seat;
    let data;
    console.log(agent);
    AgentData.fetchByName(agent).then(result => {

            return new Promise(function (resolve, reject) {
                let booked = [];
                let total = 0;
                let i = 0;
                agentdata = result;

                while (req.body[i + ""]) {
                    booked.push(req.body[i + ""]);

                    if (req.body[i + ""] == '1_1' || req.body[i + ""] == '1_2' || req.body[i + ""] == '1_3' || req.body[i + ""] == '1_4' || req.body[i + ""] == '2_1' || req.body[i + ""] == '2_2' || req.body[i + ""] == '2_3' || req.body[i + ""] == '2_4')
                        total += new Number(req.body.fc);
                    else
                        total += new Number(req.body.ec);
                    i++;
                }
                console.log(total);
                price = total
                if (req.body[i + ""] === undefined)
                    return resolve(booked);
            })

        }).then(booked => {

            seat = booked;
            console.log(booked);
            console.log(tid);
            console.log(id);
            return AgentData.booking(agent, tid, id, booked);
        }).then(result => {

            data = {
                from: agentdata.bus[tid + ""].schedule[id + ""].from,
                to: agentdata.bus[tid + ""].schedule[id + ""].to,
                passanger: seat.length,
                travels: agentdata.bus[tid + ""].name,
                phone: agentdata.bus[tid + ""].schedule[id + ""].phone,
                seat: seat,
                price: price
            }
            return UserData.booking(req.session.user.email, data);
        }).then(result => {

            return res.status(302).redirect(302, "/user/dashboard");
        })
        .catch(err => console.log(err));
}