const axios = require("axios");

const fetchClinics = function () {
  let responseData;
  const domain = process.env.CLINIC_API;
  return axios
    .get(`${domain}/dental-clinics.json`)
    .then((dentalClinicResponse) => {
      responseData = dentalClinicResponse.data;
      return axios
        .get(`${domain}/vet-clinics.json`)
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
