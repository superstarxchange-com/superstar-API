/* Generates otp of length 4 */
const generate_otp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const content_otp = (otp) => {
  return `Hi! Welcome to SuperStarXChange. Your OTP is ${otp}`;
};

module.exports = {
  generate_otp,
  content_otp,
};
