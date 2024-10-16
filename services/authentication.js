const JWT = require("jsonwebtoken");

const screat = "Target!$!CPCRegion@l$";

function createTokensForUsers(user) {
    const payload = {
        fullName : user.fullName ,
        _id : user._id ,
        email : user.email ,
        profileImageUrl : user.profileImageUrl ,
        role : user.role
    }

    const token = JWT.sign(payload , screat);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token , screat);
    return payload;
}

module.exports = {
    createTokensForUsers ,
    validateToken
}