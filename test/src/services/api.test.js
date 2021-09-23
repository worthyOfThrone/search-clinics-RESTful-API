const chai = require("chai");
chai.should();
const expect = chai.expect;
const sinon = require("sinon");
const dentalClinic = require("../../__mocks__/dental-clinic.json");
const vetClinic = require("../../__mocks__/vet-clinic.json");
const axios = require("axios");
const APIService = require("../../../src/services/api");

describe("SearchService test suits", () => {
  let stub;
  beforeEach(() => {
    stub = sinon.stub(axios, "get");
  });
  afterEach(() => {
    stub.restore();
  });

  it("fetch data from API", (done) => {
    stub.onCall(0).returns(Promise.resolve({ data: [...dentalClinic] }));
    stub.onCall(1).returns(Promise.resolve({ data: [...vetClinic] }));

    APIService.fetchClinics()
      .then((response) => {
        response.length.should.eql(15);
        response[0].should.include.keys(["name", "stateName", "availability"]);
        response[response.length - 1].should.include.keys([
          "clinicName",
          "stateCode",
          "opening",
        ]);

        done();
      })
      .catch((e) => {
        console.error(e);
        done(e);
      });
  });

  it("fetch will throw an Error if any error occured", (done) => {
    stub.onCall(0).returns(Promise.reject({ stuatusCode: 500 }));
    APIService.fetchClinics().catch((e) => {
      expect(e).to.exist;
      done();
    });
  });
});
