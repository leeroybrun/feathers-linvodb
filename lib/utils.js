"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.multiOptions = multiOptions;
exports.getSelect = getSelect;
exports.nfcall = nfcall;
function multiOptions(id, params) {
	var query = Object.assign({}, params.query);
	var options = Object.assign({ multi: true }, params.options);

	if (id !== null) {
		options.multi = false;
		query._id = id;
	}

	return { query: query, options: options };
}

function getSelect(select) {
	if (Array.isArray(select)) {
		var result = {};
		select.forEach(function (name) {
			return result[name] = 1;
		});
		return result;
	}

	return select;
}

function nfcall(ctx, method) {
	var args = Array.prototype.slice.call(arguments, 2);

	return new Promise(function (resolve, reject) {
		args.push(function (error, data) {
			if (error) {
				return reject(error);
			}

			resolve(data);
		});

		ctx[method].apply(ctx, args);
	});
}