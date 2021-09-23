"use strict";
const express = require("express");
const app = express();
const port = 80;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200);
    res.send("Hello World!");
})
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

module.exports = app;