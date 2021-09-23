const axios = require("axios");

const fetchClinics = function () {
  let responseData;
  const domain = "https://storage.googleapis.com";
  return axios
    .get(`${domain}/scratchpay-code-challenge/dental-clinics.json`)
    .then((dentalClinicResponse) => {
      responseData = dentalClinicResponse.data;
      return axios
        .get(`${domain}/scratchpay-code-challenge/vet-clinics.json`)
        .then((vetClinicResponse) => {
          return [...responseData, ...vetClinicResponse.data];
        });
    })
    .catch((err) => {
      throw(new Error(err));
    });
};

module.exports = {
  fetchClinics: fetchClinics,
};
