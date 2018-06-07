(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("rocketless", [], factory);
	else if(typeof exports === 'object')
		exports["rocketless"] = factory();
	else
		root["rocketless"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = exports.Model = undefined;

var _model = __webpack_require__(1);

var _model2 = _interopRequireDefault(_model);

var _context = __webpack_require__(2);

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Model = _model2.default;
exports.Context = _context2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphql = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"graphql\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _joinMonster = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"join-monster\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _joinMonster2 = _interopRequireDefault(_joinMonster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  function Model(knex, fields, options) {
    _classCallCheck(this, Model);

    this.knex = knex;
    this.fields = fields;
    this.options = options;
    this.graphqlObject = {};
    this.graphqlQuery = {};
    this.build();
  }

  _createClass(Model, [{
    key: "build",
    value: function build() {
      this.buildGraphqlObject();
    }
  }, {
    key: "buildGraphqlObject",
    value: function buildGraphqlObject() {
      this.graphqlObject = new _graphql.GraphQLObjectType({
        name: this.getName(),
        sqlTable: this.getName(),
        uniqueKey: "id",
        // TODO: clean fields (?)
        fields: this.fields
      });
    }
  }, {
    key: "makeGraphqlQuery",
    value: function makeGraphqlQuery() {
      var _this = this;

      this.graphqlQuery = {
        query: {
          type: new _graphql.GraphQLList(this.graphqlObject),
          resolve: function resolve(parent, args, context, resolveInfo) {
            return (0, _joinMonster2.default)(resolveInfo, context, function (sql) {
              return _this.knex.raw(sql);
            }, {
              dialect: "pg"
            });
          }
        }
      };
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.options.name || this.constructor.name.toLowerCase();
    }
  }]);

  return Model;
}();

exports.default = Model;
module.exports = exports["default"];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
  function Context(req) {
    _classCallCheck(this, Context);

    this.req = req;
    this.context = {};
  }

  // maybe use chaining


  _createClass(Context, [{
    key: "authenticate",
    value: function authenticate(options) {
      var token = this.req.headers.authorization;
      if (!token) return this;
      // TODO: auth logic
      return this;
    }
  }]);

  return Context;
}();

exports.default = Context;
module.exports = exports["default"];

/***/ })
/******/ ]);
});
//# sourceMappingURL=rocketless.js.map