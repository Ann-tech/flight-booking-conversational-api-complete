const { User } = require("../models/db.connect");

async function authorizeUser(req, res, next) {
    const user = await User.findByPk(req.user.id);
    const role = user.roleId == 1;
    
    console.log(role);
    if (!role) return res.status(403).json({success: false, message: "unauthorized access"});
    next();
}

module.exports = authorizeUser