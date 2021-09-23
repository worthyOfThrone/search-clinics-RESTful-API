const chai = require("chai");
chai.should();
const expect = chai.expect;
const sinon = require("sinon");
const dentalClinic = require("../../__mocks__/dental-clinic.json");
const vetClinic = require("../../__mocks__/vet-clinic.json");
const callAPI = require("../../../src/services/api");
const {
  searchClinics,
  findTimeSlot,
  searchMatchingClinic,
} = require("../../../src/services/SearchService");

// TODO: stub below function, and provide updated data to avoid actual mapping in this module testing
const { mappingService } = require("../../../src/services/DataMapping");

describe("SearchService test suits", () => {
  let stub;
  beforeEach(() => {
    stub = sinon.stub(callAPI, "fetchClinics");
    stub.returns([...dentalClinic, ...vetClinic]);
  });
  afterEach(() => {
    stub.restore();
  });

  // TODO: get ALl list of data

  it("Search 'City Vet Clinic' clinic ", (done) => {
    const name = "City Vet Clinic";
    searchClinics({ name })
      .then((response) => {
        response.length.should.eql(1);
        response[0].should.include.keys([
          "name",
          "stateCode",
          "stateName",
          "availability",
        ]);

        // ensuring all data is coming as per props provided
        expect(response[0]).to.have.property("name").eql(name);
        done();
      })
      .catch((e) => {
        console.error(e);
        done(e);
      });
  });

  it("Search all clinic located in CA", (done) => {
    const stateName = "california";
    searchClinics({ stateName })
      .then((response) => {
        response.length.should.eql(3);
        response[0].should.include.keys([
          "name",
          "stateCode",
          "stateName",
          "availability",
        ]);

        // ensuring all data is coming as per props provided
        for (let index = 0; index < 3; index++) {
          expect(response[index]).to.have.property("stateCode").eql("CA");
        }

        // ensuring all correct data is loaded based on name
        response[0].name.should.eql("Mount Sinai Hospital");
        response[1].name.should.eql("Scratchpay Test Pet Medical Center");
        response[2].name.should.eql("National Veterinary Clinic");
        done();
      })
      .catch((e) => {
        console.error(e);
        done(e);
      });
  });

  it("Should returns clinics located in New York", (done) => {
    const stateName = "New York";
    searchClinics({ stateName })
      .then((response) => {
        response.length.should.eql(1);
        response[0].should.include.keys([
          "name",
          "stateCode",
          "stateName",
          "availability",
        ]);

        // ensuring all data is coming as per props provided
        expect(response[0]).to.have.property("stateName").eql(stateName);

        // ensuring all correct data is loaded based on name
        response[0].should.eql({
          name: "Cleveland Clinic",
          stateName: "New York",
          stateCode: "NY",
          availability: {
            from: "11:00",
            to: "22:00",
          },
        });
        done();
      })
      .catch((e) => {
        console.error(e);
        done(e);
      });
  });

  it("Should returns matching clinics", () => {
    const searchCriteria = {
      name: "UAB Hospital",
      stateName: "Alaska",
      availability: {
        from: "12:00",
        to: "15:00",
      },
    };

    const response = searchMatchingClinic(
      mappingService(dentalClinic),
      searchCriteria
    );
    expect(response).to.be.an("array");
    expect(response).to.have.length(1);
    // ensure all the filed are proper
    expect(response[0]).to.have.property("matchingSlot");
    expect(response[0]).to.have.property("availability");
    expect(response[0]).to.have.deep.property("stateName", "Alaska");
    expect(response[0]).to.have.deep.property("stateCode", "AK");
  });

  it("Should returns matching time slot", () => {
    const searchData = {
      from: "12:00",
      to: "15:00",
    };
    const availableTimeSlot = {
      from: "00:00",
      to: "13:00",
    };

    const response = findTimeSlot(searchData, availableTimeSlot);
    expect(response.isValid).to.be.true;
    expect(response.overlappingTime).to.eql({
      from: "12:00",
      to: "13:00",
    });
  });
});
