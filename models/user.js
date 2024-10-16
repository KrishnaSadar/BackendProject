const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('node:crypto');
const { createTokensForUsers } = require("../services/authentication");

const userSchema = new Schema({
    fullName: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    salt: { type: String },
    password: { required: true, type: String },
    profileImageUrl: { type: String, default: "/images/default.png" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified()) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = hashPassword;

    next();
});

// Static method to check password match
userSchema.static("matchPasswordAndGenerateTokens", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("User Not Found!");
    }

    const salt = user.salt;
    const hashPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    if (hashPassword !== userProvidedHash) {
        throw new Error("Wrong Password!");
    }

    const token = createTokensForUsers(user);
    return token;
});

const User = model("User", userSchema);

module.exports = User;
