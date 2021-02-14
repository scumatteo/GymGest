const crypto = require("crypto");

export default function encodePassword(password){
    return crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
}