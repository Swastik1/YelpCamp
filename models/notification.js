var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NotificationSchema = new Schema({
    isRead: {type: Boolean, default: false},
    adminRequest: {type: Boolean, default: false},
    pendingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }                
},{
    timestamps: true
});
module.exports = mongoose.model("Notification", NotificationSchema);