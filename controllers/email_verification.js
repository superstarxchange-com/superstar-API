const sgMail = require("@sendgrid/mail");
const db = require("_helpers/db");
const OTP = require("../_middleware/otp.js");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.send_mail_otp = async (req, res) => {
  const { email } = req.body;
  try {
    if (email) {
      // find if email exist:
      const user = await db.User.findOne({ where: { email: email } });
      if (user) {
        res.status(400).send("Email already Registered, Please login.");
      } else {
        const otp = OTP.generate_otp();
        // search if otp was sent before:
        if (await db.email_otp.findOne({ where: { email: email } })) {
          // update the otp:
          const update_status = await db.email_otp.update(
            { otp: otp },
            { where: { email: email } }
          );
          if (update_status) {
            const msg = {
              to: email, // user email.
              from: "hello@superstarxchange.com", // sender email.
              subject: "SuperStarXchange Email Verification",
              //text: `Please click on the link below to change the password ${req.user}`,
              html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Superstarxchange</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing Superstarxchange. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                <p style="font-size:0.9em;">Regards,<br />Superstarxchange</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Superstarxchange</p>
                </div>
              </div>
            </div>`,
            };
            sgMail
              .send(msg)
              .then(async () => {
                // insert into the DB:

                res.status(200).send({
                  message: "OTP sent.",
                  email: email,
                });
              })
              .catch((error) => {
                res.status(500).send({ message: "Internal server error" });
                console.error(error);
              });
          }
        } else {
          // insert into email_otp table:
          const insert_status = await db.email_otp.create({
            email,
            otp,
          });
          if (insert_status) {
            const msg = {
              to: email, // user email.
              from: "hello@superstarxchange.com", // sender email.
              subject: "SuperStarXchange Email Verification",
              //text: `Please click on the link below to change the password ${req.user}`,
              html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Superstarxchange</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing Superstarxchange. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                <p style="font-size:0.9em;">Regards,<br />Superstarxchange</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Superstarxchange</p>
                </div>
              </div>
            </div>`,
            };
            sgMail
              .send(msg)
              .then(async () => {
                res.status(200).send({
                  message: "OTP sent.",
                  email: email,
                });
              })
              .catch((error) => {
                res.status(500).send({ message: "Internal server error" });
                console.error(error);
              });
          } else {
            res.status(500).send("Internal server error.");
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

exports.verify_email_otp = async function (req, res) {
  const { email, otp } = req.body;
  try {
    const verification_status = await db.email_otp.findOne({
      where: { email: email, otp: otp },
    });
    if (verification_status) {
      return res.status(200).send("OTP Verified successfully!");
    } else {
      return res.status(400).send("Wrong OTP");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

//exports = { send_mail_otp, verify_email_otp };
