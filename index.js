"use strict";
const express = require("express");
const app = express();
const port = 80;

const searchRoute = require("./src/routes/search");
const generalRoutes = require("./src/routes/generalRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// load search router
searchRoute.loadSearchRoutes(app);

// below route is added for information purpose only
// I have added this to inform you guyz that I have got the countries data
// which i have stored in constants folder
app.use(generalRoutes);

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

module.exports = app;