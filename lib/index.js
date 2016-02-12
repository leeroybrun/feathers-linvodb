'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = init;

var _uberproto = require('uberproto');

var _uberproto2 = _interopRequireDefault(_uberproto);

var _feathersQueryFilters = require('feathers-query-filters');

var _feathersQueryFilters2 = _interopRequireDefault(_feathersQueryFilters);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!global._babelPolyfill) {
	require('babel-polyfill');
}

// Create the service.

var Service = function () {
	function Service(options) {
		_classCallCheck(this, Service);

		if (!options) {
			throw new Error('NeDB options have to be provided');
		}

		if (!options.Model) {
			throw new Error('NeDB datastore `Model` needs to be provided');
		}

		this.Model = options.Model;
		this.id = '_id';
		this.paginate = options.paginate || {};
	}

	_createClass(Service, [{
		key: 'extend',
		value: function extend(obj) {
			return _uberproto2.default.extend(obj, this);
		}
	}, {
		key: '_find',
		value: function _find(params, count) {
			var getFilter = arguments.length <= 2 || arguments[2] === undefined ? _feathersQueryFilters2.default : arguments[2];

			// Start with finding all, and limit when necessary.
			var query = this.Model.find(params.query);
			var filters = getFilter(params.query || {});

			// $select uses a specific find syntax, so it has to come first.
			if (filters.$select) {
				query = this.Model.find(params.query, (0, _utils.getSelect)(filters.$select));
			}

			// Handle $sort
			if (filters.$sort) {
				query.sort(filters.$sort);
			}

			// Handle $limit
			if (filters.$limit) {
				query.limit(filters.$limit);
			}

			// Handle $skip
			if (filters.$skip) {
				query.skip(filters.$skip);
			}

			var runQuery = function runQuery(total) {
				return (0, _utils.nfcall)(query, 'exec').then(function (data) {
					return {
						total: total,
						limit: filters.$limit,
						skip: filters.$skip || 0,
						data: data
					};
				});
			};

			if (count) {
				return (0, _utils.nfcall)(this.Model, 'count', params.query).then(runQuery);
			}

			return runQuery();
		}
	}, {
		key: 'find',
		value: function find(params) {
			var _this = this;

			var paginate = !!this.paginate.default;
			var result = this._find(params, paginate, function (query) {
				return (0, _feathersQueryFilters2.default)(query, _this.paginate);
			});

			if (!paginate) {
				return result.then(function (page) {
					return page.data;
				});
			}

			return result;
		}
	}, {
		key: '_get',
		value: function _get(_id) {
			return (0, _utils.nfcall)(this.Model, 'findOne', { _id: _id }).then(function (doc) {
				if (!doc) {
					throw new _feathersErrors2.default.NotFound('No record found for id \'' + _id + '\'');
				}

				return doc;
			});
		}
	}, {
		key: 'get',
		value: function get(id, params) {
			return this._get(id, params);
		}
	}, {
		key: '_findOrGet',
		value: function _findOrGet(id, params) {
			if (id === null) {
				return this._find(params).then(function (page) {
					return page.data;
				});
			}

			return this._get(id, params);
		}
	}, {
		key: 'create',
		value: function create(data) {
			return (0, _utils.nfcall)(this.Model, 'insert', data);
		}
	}, {
		key: 'patch',
		value: function patch(id, data, params) {
			var _this2 = this;

			var _multiOptions = (0, _utils.multiOptions)(id, params);

			var query = _multiOptions.query;
			var options = _multiOptions.options;

			// We can not update the id

			delete data[this.id];

			// Run the query
			return (0, _utils.nfcall)(this.Model, 'update', query, { $set: data }, options).then(function () {
				return _this2._findOrGet(id, params);
			});
		}
	}, {
		key: 'update',
		value: function update(id, data, params) {
			var _this3 = this;

			if (Array.isArray(data) || id === null) {
				return Promise.reject('Not replacing multiple records. Did you mean `patch`?');
			}

			var _multiOptions2 = (0, _utils.multiOptions)(id, params);

			var query = _multiOptions2.query;
			var options = _multiOptions2.options;

			// We can not update the id

			delete data[this.id];

			return (0, _utils.nfcall)(this.Model, 'update', query, data, options).then(function () {
				return _this3._findOrGet(id);
			});
		}
	}, {
		key: 'remove',
		value: function remove(id, params) {
			var _this4 = this;

			var _multiOptions3 = (0, _utils.multiOptions)(id, params);

			var query = _multiOptions3.query;
			var options = _multiOptions3.options;


			return this._findOrGet(id, params).then(function (items) {
				return (0, _utils.nfcall)(_this4.Model, 'remove', query, options).then(function () {
					return items;
				});
			});
		}
	}]);

	return Service;
}();

function init(options) {
	return new Service(options);
}

init.Service = Service;
module.exports = exports['default'];