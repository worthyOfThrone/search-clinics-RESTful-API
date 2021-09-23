const countriesData = require("../constants/countries.json");
const { removeDuplicates } = require("../utils");
const areIntervalsOverlapping = require("date-fns/areIntervalsOverlapping");
const isAfter = require("date-fns/isAfter");
const { mappingService } = require("./DataMapping");

const callAPI = require("./api");

const searchClinics = async (params) => {
  return Promise.resolve(callAPI.fetchClinics())
    .then((clinics) => {
      const mappedResponse = mappingService(clinics);
      return searchMatchingClinic(mappedResponse, params);
    })
    .catch((err) => {
      console.log(err);
      return "Something went wrong: " + err;
    });
};

const findTimeSlot = (searchTime, availability) => {
  // created time slots for each duration i.e. search criteria duration and available duration
  const selectedStartTime = searchTime.from.split(":");
  const selectedEndTime = searchTime.to.split(":");
  const startTime = availability.from.split(":");
  const endTime = availability.to.split(":");

  // check if the search duration for respective clinic is available or not
  const result = areIntervalsOverlapping(
    {
      start: new Date(2001, 0, 1, selectedStartTime[0], selectedStartTime[1]),
      end: new Date(2001, 0, 1, selectedEndTime[0], selectedEndTime[1]),
    },
    {
      start: new Date(2001, 0, 1, startTime[0], startTime[1]),
      end: new Date(2001, 0, 1, endTime[0], endTime[1]),
    }
  );

  // find matching time slots
  const overlappedStartTime = isAfter(
    new Date(2001, 0, 1, selectedStartTime[0], selectedStartTime[1]),
    new Date(2001, 0, 1, startTime[0], startTime[1])
  );
  const overlappedEndTime = isAfter(
    new Date(2001, 0, 1, selectedEndTime[0], selectedEndTime[1]),
    new Date(2001, 0, 1, endTime[0], endTime[1])
  );
  const overlappingTime = {
    from: overlappedStartTime
      ? selectedStartTime.join(":")
      : startTime.join(":"),
    to: overlappedEndTime ? endTime.join(":") : selectedEndTime.join(":"),
  };

  return {
    isValid: result,
    overlappingTime,
  };
};

const searchMatchingClinic = (data, searchCriteria) => {
  if (!searchCriteria) {
    return removeDuplicates(data);
  } else if (!data.length) {
    return [];
  }
  // TODO: Place 'availability' at the last of search Criteria to reduce comparisons
  
  if (searchCriteria.stateName) {
    // convert stateName to stateCode to search for this state name on all provided data
    // compare state code/name after converting to lowercase to draw better results
    const stateCode = countriesData.states.find((obj) =>
      [obj.name.toLowerCase(), obj.code.toLowerCase()].includes(searchCriteria.stateName.toLowerCase())
    );
    searchCriteria.stateCode = stateCode && stateCode.code;

    delete searchCriteria.stateName;
  }

  // store all matching slot in below array to map them to data
  let timeSlotResponse = [];

  const response = data
    .filter((item, index) => {
      let isValid = true;
      for (const key in searchCriteria) {
        if (key === "availability") {
          // is time slot valid?
          timeSlotResponse[index] = findTimeSlot(
            searchCriteria[key],
            item[key]
          );
          isValid = isValid && timeSlotResponse[index].isValid;
        } else {
          isValid = isValid && item[key] == searchCriteria[key];
        }
      }
      return isValid;
    })
    .map((res, index) => {
      return {
        // add another property to describe matchingTimeSlot for taking appointment
        ...(timeSlotResponse[index] && {
          matchingSlot: timeSlotResponse[index].overlappingTime,
        }),
        ...res,
      };
    });
  // remove duplicates between dental and vet clinic e.g. Scratchpay Test Pet Medical Center
  return removeDuplicates(response);
};

module.exports = {
  searchMatchingClinic,
  searchClinics,
  findTimeSlot,
};
