const express = require("express");
const buyTicketWithStripe = require("../controllers/ticket.controller");

const routes = express.Router();

// Ticket Purchase
routes.post("/purchase-tickets", buyTicketWithStripe);

module.exports = routes;
