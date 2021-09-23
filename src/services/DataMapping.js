const countriesData = require("../constants/countries.json");

const mappingService = (data) => {
    return data.map(({
        clinicName: name,
        opening: availability,
        stateCode,
        stateName,
        ...rest
    }) => {
        const country = countriesData.states.find(obj => (obj.name.toLowerCase() === (stateName && stateName.toLowerCase()) || obj.code === stateCode));
        return {
            name,
            stateCode: (country && country.code) || stateCode,
            stateName: (country && country.name) || stateName,
            availability,
            ...rest
        };
    });
};
module.exports = {
    mappingService
};