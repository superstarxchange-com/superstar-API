const sgMail = require("@sendgrid/mail");
const db = require("_helpers/db");

exports.subscribe = async (req, res) => {
  const email = req.params.email;
  if (email) {
    try {
      // insert mail to subscriber's list:
      const result = await db.subscribe.create({ email: email });
      if (result) {
        return res.status(200).json({ message: "Subscribed Successfully!" });
      } else {
        return res.status(500).json({ message: "Error in subscribing." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error!" });
    }
  } else {
    return res.status(400).send("Invalid request parameters!!");
  }
};
