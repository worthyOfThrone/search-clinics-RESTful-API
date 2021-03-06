const SearchClinicsController = require("../services/SearchService");

const loadSearchRoutes = (app, controller = SearchClinicsController) => {
	// @route GET /api/search
	// @description Search clinic based on some search criteria
	// @access Public
	app.get("/api/search", async(req, res) => {
		const listOfMatchingClinics = await controller.searchClinics(req.body);
		res.status(200);
		res.send(listOfMatchingClinics);
	});
};

module.exports = {loadSearchRoutes};