const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const userService = require("../services/user.service");
const sendSMS = require("../_middleware/twilio.js");
const OTP = require("../_middleware/otp.js");
const Adminauthorize = require("../_middleware/authorize");
const db = require("_helpers/db");
const {
  forget_password,
  changePassword,
  updatePassword,
} = require("./change_password");
const { send_mail_otp, verify_email_otp } = require("./email_verification");

// routes
router.post("/authenticate", authenticateSchema, authenticate);
router.get("/forget-password/:email", forget_password);
router.get("/change-password/:user_id/:token", changePassword);
router.post("/update-password", updatePassword);
router.post("/register", registerSchema, register);
router.post("/add-admin", Adminauthorize(), addAdmin);
router.get("/", authorize(), getAll);
router.get("/current", authorize(), getCurrent);
router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);
router.post("/send-otp", send_mail_otp);
router.post("/verify-otp", verify_email_otp);
router.post("/mobile-verification", async (req, res) => {
  const { mobile_number } = req.body;
  console.log(mobile_number);
  // check if number already exist in the otp db:
  const registered = await db.User.findOne({
    where: { mobile_number: mobile_number },
  });
  if (registered) {
    return res.status(200).json({ message: "Number already registered." });
  }

  try {
    const exist = await db.mobile_verification_status.findOne({
      where: { mobile_number: mobile_number },
    });
    if (exist) {
      // generate OTP:
      const otp = OTP.generate_otp();
      // update the DB:
      const update_status = await db.mobile_verification_status.update(
        { otp: otp },
        { where: { mobile_number: mobile_number } }
      );
      if (update_status) {
        // send SMS:
        await sendSMS(mobile_number, `OTP for SuperStarXchange is ${otp}`);
        return res.status(200).json({ message: "OTP sent successfully" });
      } else {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      // generate OTP:
      const otp = OTP.generate_otp();
      // insert into the table:
      const insert_status = await db.mobile_verification_status.create({
        mobile_number,
        otp,
      });
      if (insert_status) {
        // send SMS to the client mobile:
        await sendSMS(mobile_number, `OTP for SuperStarXchange is ${otp}`);
        return res.status(200).json({ message: "OTP sent successfully" });
      } else {
        return res.status(500).json({ message: "Internal Server Error." });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error." });
  }
});
/*
router.post("/mobile-verification", (req, res, next) => {
  db.query(
    `SELECT * FROM mobile_verification_status WHERE mobile_number = ${db.escape(
      req.body.mobile_number
    )};`,
    (err, result) => {
      if (err) return res.status(500).send({ msg: err });
      // If mobile number is already in db
      else if (result.length) {
        db.query(
          `SELECT * FROM mobile_verification_status WHERE mobile_number = ${db.escape(
            req.body.mobile_number
          )};`,
          (err, result) => {
            if (err) return res.status(500).send({ msg: err });
            // If mobile number is in db and If status is verified
            else if (result[0]["status"] == 1)
              return res.status(200).send({
                msg: "Specified mobile number is already registered!",
              });
            // If mobile number is in db and status is not verified
            else {
              db.query(
                `DELETE FROM mobile_verification_status WHERE mobile_number = ${db.escape(
                  req.body.mobile_number
                )};`
              );
              otp = OTP.generate_otp();
              // sendSMS(req.body.mobile_number, OTP.content_otp(otp));
              console.log(otp);
              bcrypt.hash(otp, 10, (err, otp_hash) => {
                db.query(
                  `INSERT INTO mobile_verification_status (mobile_number, otp) VALUES (${db.escape(
                    req.body.mobile_number
                  )}, '${otp_hash}');`,
                  (err, result) => {
                    if (err) return res.status(500).send({ msg: err });
                    else
                      return res.status(202).send({
                        msg: "Accepted!",
                        mobile_number: req.body.mobile_number,
                      });
                  }
                );
              });
            }
          }
        );
      }
      // If mobile number is not in db
      else {
        otp = OTP.generate_otp();
        // sendSMS(req.body.mobile_number, OTP.content_otp(otp));
        console.log(otp);
        bcrypt.hash(otp, 10, (err, otp_hash) => {
          if (err) return res.status(500).send({ msg: err });
          db.query(
            `INSERT INTO mobile_verification_status (mobile_number, otp) VALUES (${db.escape(
              req.body.mobile_number
            )}, '${otp_hash}');`,
            (err, result) => {
              if (err) return res.status(500).send({ msg: err });
              else
                return res.status(202).send({
                  msg: "Accepted!",
                  mobile_number: req.body.mobile_number,
                });
            }
          );
        });
      }
    }
  );
});

// doesn't include verification time deadline
/*
  body = {
    mobile_number = "+91***",
    otp = "1234"
  }
  */

router.post("/mobile-verification-otp", async (req, res) => {
  const { mobile_number, otp } = req.body;
  // search the DB for the OTP:
  try {
    const verify_otp = await db.mobile_verification_status.findOne({
      where: { mobile_number: mobile_number, otp: otp },
    });
    if (verify_otp) {
      res.status(200).json({ message: "OTP Verified Successfully" });
    } else {
      return res.status(400).json({ message: "Mobile number or OTP invalid" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});
/*
router.post("/mobile-verification-otp", (req, res, next) => {
  db.query(
    `SELECT * FROM mobile_verification_status WHERE mobile_number = ${db.escape(
      req.body.mobile_number
    )};`,
    (err, result) => {
      // mobile number does not exists
      if (err) return res.status(400).send({ msg: err });
      if (!result.length) return res.status(401).send({ msg: "Invalid OTP!" });
      // check otp
      bcrypt.compare(req.body.otp, result[0]["otp"], (bErr, bResult) => {
        if (bErr) return res.status(401).send({ msg: "Invalid OTP!" });
        // Crt otp
        if (bResult) {
          db.query(
            `UPDATE mobile_verification_status SET status = 1 WHERE mobile_number = ${db.escape(
              result[0].mobile_number
            )};`
          );
          return res.status(200).send({
            msg: "Mobile number is verified successfully!",
            mobile_number: result[0].mobile_number,
          });
        }
        // wrong otp
        return res.status(401).send({
          msg: "Invalid OTP!",
        });
      });
    }
  );
});
*/
module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    mobile_number: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "Registration successful" }))
    .catch(next);
}
function addAdmin(req, res, next) {
  userService
    .createAdmin(req.body)
    .then((pkh) => res.json({ message: "Add Admin successful", result: pkh }))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    email: Joi.string().empty(""),
    password: Joi.string().min(6).empty(""),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}
