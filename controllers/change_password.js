const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const db = require("_helpers/db");
const bcrypt = require("bcryptjs");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forget_password = async function (req, res) {
  const email = req.params.email;
  try {
    const user = await db.User.findOne({ where: { email: email } });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const save_token = await db.changePassword.create({
        email: email,
        token: token,
      });
      const link = `${process.env.BACK_BASE_URL}/users/change-password/${user.id}/${token}`;
      console.log(link);
      const msg = {
        to: email, // user email.
        from: "hello@superstarxchange.com", // sender email.
        subject: "SuperStarXchange Reset Password",
        //text: `Please click on the link below to change the password ${req.user}`,
        html: `
        <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email</title>
            <meta name="description" content="Reset Password Email.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    A unique link to reset your password has been generated for you. To reset your password, click the
                                                    following link and follow the instructions.
                                                </p>
                                                <a href=${link}
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                    Password</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>superstarxchange inc.</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>`,
      };
      sgMail
        .send(msg)
        .then(async () => {
          console.log("Email sent");
          res.status(200).send({
            message: "password reset link sent to your email account",
          });
        })
        .catch((error) => {
          res.status(500).send({ message: "Internal server error" });
          console.error(error);
        });
    } else {
      return res.status(400).send("User does not exist.");
    }
  } catch (error) {
    console.log("error in forget password: ", error);
    return res.status(500).send("Internal server error.");
  }
};

exports.changePassword = async function (req, res) {
  const { user_id, token } = req.params;
  const user = await db.User.findOne({ where: { id: user_id } });
  if (user) {
    const verifyToken = await db.changePassword.findOne({
      where: { email: user.email, token: token },
    });
    if (verifyToken) {
      res.redirect(`${process.env.FRONT_URL}/user/change-password/${user_id}`);
    }
  } else {
  }
};

exports.updatePassword = async function (req, res) {
  const { user_id, password } = req.body;
  try {
    if (user_id && password) {
      db.User.update(
        // Values to update
        { hash: await bcrypt.hash(password, 10) },
        {
          // Clause
          where: {
            id: user_id,
          },
        }
      ).then(() => {
        console.log("password successfully updated");
        return res
          .status(200)
          .send({ message: "password successfully updated!" });
      });
    } else {
      return res.status(400).send({ message: "Bad Request parameters!" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error!" });
  }
};
