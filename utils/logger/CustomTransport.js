"use strict";

const util = require("util");
const Transport = require("winston-transport");

function Custom(options = {}) {
	options.objectMode = true;
	Transport.call(this, options);
}

Custom.prototype.log = function (info, callback) {
	callback();
};

util.inherits(Custom, Transport);

Custom.prototype.name = "CustomTransport";

module.exports = Custom;
