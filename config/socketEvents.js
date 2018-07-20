var mongoose = require('mongoose');
var User = require('../models/user');
var Notification = require('../models/notification');
//Create notification that new signed up user wishes to become an admin
exports = module.exports = function(io, app) {
    console.log(app);
    io.on("connection", function(socket) {
        socket.on("requestAdmin", () => {
            var notification = new Notification();
            notification.adminRequest = true;
        });
    })
}


