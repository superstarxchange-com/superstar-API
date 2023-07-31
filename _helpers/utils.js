const crypto = require("crypto");
const aes256 = require("aes256");

function sha256(msg){
    return crypto.createHash('sha256').update(msg).digest('hex')
}

function strTohex(str){
    return Buffer.from(str).toString('hex');
}

function hexTostr(hex){
    return Buffer.from(hex, 'hex').toString();
}

function encode(admin_sk, user_sk, user_password){
    const new_password = sha256(user_password + admin_sk);
    return strTohex(aes256.encrypt(new_password, user_sk));
}

function decode(admin_sk, encoded_sk, user_password){
    const new_password = sha256(user_password+admin_sk);
    return aes256.decrypt(new_password, hexTostr(encoded_sk));
}

const handleSuccessResponse = (res, data, statusCode = 200) => res.status(statusCode).json({
  status: 'Success',
  data,
});

const handleErrorResponse = (res, error, statusCode = 400) => res.status(statusCode).json({
  status: 'Request Failed',
  error,
});

const handleTaquitoSuccessResponse = (res, data, statusCode = 200) => res.status(statusCode).json({
  status: 'Success',
  data,
});

const handleTaquitoErrorResponse = (res, error, statusCode = 400) => res.status(statusCode).json({
  status: 'Request Failed',
  name: error.name,
  message: error.message,
  kind: error.kind,
  id: error.id
});

module.exports = {
  encode,
  decode,
  handleErrorResponse,
  handleSuccessResponse,
  handleTaquitoSuccessResponse,
  handleTaquitoErrorResponse
};