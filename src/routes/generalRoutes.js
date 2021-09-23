const router = require("express").Router();
const axios = require("axios");

// @route GET /getUSStateCode
// @description ONLY A REFERENCE API: get state code of all states of the United States 
// @access Public
router.get("/getUSStateCode", (req, res) => {
    // using below API we can get stateCode of all the states
    // I have stored response of this API in JSON. because it will be needed everytime
    // if in future, we want to support states from any other country, we can get those stateCodes using this API
    axios.get("https://api.printful.com/countries")
        .then((countriesData) => {
            const unitedStateData = countriesData.data.result.find(obj => obj.name === "United States");
            res.send(unitedStateData);
        })
        .catch(err => {
            res.send(err);
    });
});

module.exports = router;