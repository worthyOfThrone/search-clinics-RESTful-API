# search-clinics-RESTful-API
This is an application providing a RESTful API to get a list of clinics and allow search operation on them.

### Installation

The application is built on  [Node.js](https://nodejs.org/) v10.x+.

Install the dependencies and start the server.

```sh
$ npm install
$ npm start
```

Extract the postman collection attached to the email, and try out the /search routes with different search criteria by yourself.

### Tech Stack

The application is built on top of the below JS libraries:
* [express (v4.17)](https://expressjs.com/): Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. 
* [dotenv (v10.0)](https://www.npmjs.com/package/dotenv): The dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on the Twelve-Factor App methodology. I have used it to store static URLs and port number variables.
* [date-fns (v2.24)](https://date-fns.org/) Modern JavaScript date utility library
date-fns provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript dates in a browser & Node.js. It is a good alternative to moment.js (deprecated).
* [nodemon (v2.0.12)](https://www.npmjs.com/package/nodemon) Nodemon is a tool that helps develop node. js based applications by automatically restarting the node application when file changes in the directory are detected.
* [mocha (v9.1.1)](https://mochajs.org/) Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting while mapping uncaught exceptions to the correct test cases.
* [chai (v4.3.4)](https://www.chaijs.com/) Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
* [sinon (v11.1.2)](https://sinonjs.org/) Standalone test spies, stubs and mocks for JavaScript. Works with any unit testing framework.
* [nyc (v15.1)](https://www.npmjs.com/package/nyc) Used Istanbul nyc package to list out test case coverage.

### project directory overview
- `index.js` is an entry point of the application.
- `.env` file contains application configuration.
- `src` contains constants, `routes` and `services` to allow search operation on routes
    - `routes` contains the internal routes of RestApi.
        - `routes/search.js` contains search routes to serve the user with matching clinic's data based on the request body data sent along with the request i.e. `GET /api/search`. Note: It will return a list of all clinics if request body data does not contain any search criteria.
        - `routes/generalRoutes.js` includes an informative public route to get a country's data that contains state name and code for all possible countries of the world. We would use this to standardize the clinics' data and give better results of search criteria. I have added it solely for informative purposes and saved the data for the only US States in constants. The application can be enhanced to store all countries' data if it would be useful.
    - `src/services` contains services as follow:
        - `api.js` call external API to get clinic data
        - `DataMapping.js` contains logic to standardize data before sending it to searching business logic
        - `SearchService.js` contains business logic to search standard data based on different search criteria. It also has the logic to get matching time slots as per search criteria and respective matching clinic's availability.
    - `src/utils.js` contains utility functions.
- `test` contains all the unit test cases based on the directory structure of this application
 
## How to consume the REST API?
There are 2 endpoints `/api/search`,  `/api/getUSStateCode`.
There are number of variations in request body to get desired results
- can search a clinic based on any/all of the following: name, stateName i.e. name/code and availability.
- can get list of all clinics if no search criteria is send through request request body data.
- can get list of all states under US with `/api/getUSStateCode` API.
- search criteria: 
    -  `{"stateName": "CA"}` search all dental and vet clinics located in California
    -  `{"stateName": "CA", "name": "Mount Sinai Hospital"}` search specific clinic named 'Mount Sinai Hospital' located in California
    -  `{"stateName": "new york"}` search all dental and vet clinics located in New York
    -  `{"stateName": "CA", "availability": {"from": "12:00","to": "14:30"}}` search all dental and vet clinics located in California which can be available in the time slot sent through availability. 

Below are a few curl examples to request the API and get their responses. 

### Get a list of all Dental and Vet Clinics
use the below CURL example to get a list of all the dental and vet clinics.

`GET /api/search`

    curl --location --request GET 'http://localhost:80/api/search' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    }'
#### Response
[{"name":"Good Health Home","stateCode":"AK","stateName":"Alaska","availability":{"from":"10:00","to":"19:30"}},{"name":"Mayo Clinic","stateCode":"FL","stateName":"Florida","availability":{"from":"09:00","to":"20:00"}},{"name":"Cleveland Clinic","stateCode":"NY","stateName":"New York","availability":{"from":"11:00","to":"22:00"}},{"name":"Hopkins Hospital Baltimore","stateCode":"FL","stateName":"Florida","availability":{"from":"07:00","to":"22:00"}},{"name":"Mount Sinai Hospital","stateCode":"CA","stateName":"California","availability":{"from":"12:00","to":"22:00"}},{"name":"Tufts Medical Center","stateCode":"KS","stateName":"Kansas","availability":{"from":"10:00","to":"23:00"}},{"name":"UAB Hospital","stateCode":"AK","stateName":"Alaska","availability":{"from":"11:00","to":"22:00"}},{"name":"Swedish Medical Center","stateCode":"AZ","stateName":"Arizona","availability":{"from":"07:00","to":"20:00"}},{"name":"Scratchpay Test Pet Medical Center","stateCode":"CA","stateName":"California","availability":{"from":"00:00","to":"24:00"}},{"name":"Scratchpay Official practice","stateCode":"TN","stateName":"Tennessee","availability":{"from":"00:00","to":"24:00"}},{"name":"National Veterinary Clinic","stateCode":"CA","stateName":"California","availability":{"from":"15:00","to":"22:30"}},{"name":"German Pets Clinics","stateCode":"KS","stateName":"Kansas","availability":{"from":"08:00","to":"20:00"}},{"name":"City Vet Clinic","stateCode":"NV","stateName":"Nevada","availability":{"from":"10:00","to":"22:00"}}]

### Get a list of all Dental and Vet Clinics located in California
use the below CURL example to get a list of all the dental and vet clinics located in California. You can also try sending California, CA or california, or any other state name/code in stateName property. 

`GET /api/search`

    curl --location --request GET 'http://localhost:80/api/search' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "stateName": "CA"
    }'
#### Response
[{"name":"Mount Sinai Hospital","stateCode":"CA","stateName":"California","availability":{"from":"12:00","to":"22:00"}},{"name":"Scratchpay Test Pet Medical Center","stateCode":"CA","stateName":"California","availability":{"from":"00:00","to":"24:00"}},{"name":"National Veterinary Clinic","stateCode":"CA","stateName":"California","availability":{"from":"15:00","to":"22:30"}}]

### Get a list of all Dental and Vet Clinics located in New York
use the below CURL example to get a list of all the dental and vet clinics located in New York. Note you can send value of stateName in any letter-case (upper/lower case), i.e. stateName is case insensitive. But make sure that you send the right state name/code as per the states of the clinics' data.

`GET /api/search`

    curl --location --request GET 'http://localhost:80/api/search' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "stateName": "new York"
    }'
#### Response
[{"name":"Cleveland Clinic","stateCode":"NY","stateName":"New York","availability":{"from":"11:00","to":"22:00"}}]

### Get a list of all Dental and Vet Clinics available in a specific time slot
use the below CURL example to get a list of all the dental and vet clinics which are available during the specified time slot for respective search criteria.

`GET /api/search`

    curl --location --request GET 'http://localhost:80/api/search' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "stateName": "CA",
        "availability": {
            "from": "12:00",
            "to": "14:30"
        }
    }'
#### Response
[{"matchingSlot":{"from":"12:00","to":"14:30"},"name":"Mount Sinai Hospital","stateCode":"CA","stateName":"California","availability":{"from":"12:00","to":"22:00"}},{"matchingSlot":{"from":"12:00","to":"14:30"},"name":"Scratchpay Test Pet Medical Center","stateCode":"CA","stateName":"California","availability":{"from":"00:00","to":"24:00"}}]


### Get Specific Clinic by its Name
use the below CURL example to specific dental/vet clinic by its name.

`GET /api/search`

    curl --location --request GET 'http://localhost:80/api/search' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "Hopkins Hospital Baltimore"
    }'
#### Response
[{"name":"Hopkins Hospital Baltimore","stateCode":"FL","stateName":"Florida","availability":{"from":"07:00","to":"22:00"}}]