"use strict";
const fs = require("fs");
const generateSwaggerJSON = require("../utils/generateSwaggerJSON");

generateSwaggerJSON()
	.then(json => fs.writeFileSync("./public/swagger.json", JSON.stringify(json, null, 4)));

