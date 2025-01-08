const NewsLetter = require("../models/newsLetter.model");
const Ticket = require("../models/ticket.model");
const { emailTemp } = require("../templates/emailTemp");
const { sendMail } = require("../utils/sendMail");

exports.joinNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "email is required",
      });
    }

    let newsletter = await NewsLetter.findOne({ email });
    if (newsletter) {
      return res.status(400).json({
        status: 400,
        messgae: "already subscribed",
      });
    }

    let subscribe = await NewsLetter.create({ email });
    return res.status(200).json({
      status: 200,
      message: "Successfully subscribed to the newsletter",
      data: subscribe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};


exports.getAllSubscribedUsers = async (req, res) => {
  try {
    const users = await NewsLetter.find({});
    return res.send(users);
  } catch (error) { }
};


exports.sendNewsLetter = async (req, res) => {
  try {
    const { sub, body } = req.body;
    const subscibedUsers = await NewsLetter.find({});
    const emails = subscibedUsers.map((user) => user.email);
    const emailString = emails.join(", ");
    sendMail(process.env.TO_EMAIL, emailString, sub, body);
    res.send("Email sent");
  } catch (error) {
    return res.status(500).json({ messgae: error.message });
  }
};

exports.sendMailBasedOnSpecificClass = async (req, res) => {
  try {
    const { classId, sub, body } = req.body;
    const getAllReleventTickets = await Ticket.find({ classId });
    const emails = getAllReleventTickets.map((user) => user.email);
    const emailString = emails.join(", ");
    sendMail(process.env.TO_EMAIL, emailString, sub, body);
    res.send("Email sent");
  } catch (error) {
    return res.status(500).json({ messgae: error.message });
  }
}
