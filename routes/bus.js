const exp = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const controller = require('../controllers/bus');
const BusRouter = exp.Router();
const isAuth = require('../middleware/is_auth');
const isNotAuth = require('../middleware/is_not_auth');

BusRouter.post('/display_bus', controller.busdisplay);
BusRouter.post('/seat/:agent/:tid/:id', isAuth, controller.seatselection);

BusRouter.post("/seatdata", isAuth, controller.booking);
module.exports = BusRouter;