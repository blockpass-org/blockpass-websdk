"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APPLINK_ENV = {
  local: "blockpass-local",
  staging: "blockpass-staging",
  prod: "blockpass"
};


var DEFAULT_API = {
  local: "http://172.16.0.203:1337",
  dev: "http://172.16.21.165:1337",
  staging: "https://sandbox-api.blockpass.org",
  prod: "https://asia-api.blockpass.org"
};

/**
 * Blockpass WebSDK
 */

var WebSDK = function (_EventEmitter) {
  (0, _inherits3.default)(WebSDK, _EventEmitter);

  /**
   * Constructor
   * @param {...ConstructorParams} configData
   */
  function WebSDK(configData) {
    (0, _classCallCheck3.default)(this, WebSDK);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WebSDK.__proto__ || (0, _getPrototypeOf2.default)(WebSDK)).call(this));

    var _ref = configData || {},
        baseUrl = _ref.baseUrl,
        clientId = _ref.clientId,
        env = _ref.env,
        refreshRateMs = _ref.refreshRateMs;

    if (!clientId) throw new Error("Missing critical config paramaters: clientId");

    _this.env = env || "prod";
    _this.refreshRateMs = refreshRateMs || 500;
    _this.baseUrl = baseUrl || DEFAULT_API[_this.env];
    _this.clientId = clientId;
    return _this;
  }

  /**
   * Generate new SSO code and monitor status
   * @fire WebSDK#code-refresh
   * @fire WebSDK#sso-processing
   * @fire WebSDK#sso-complete
   */


  (0, _createClass3.default)(WebSDK, [{
    key: "generateSSOData",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var baseUrl, clientId, response;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                baseUrl = this.baseUrl, clientId = this.clientId;
                _context.prev = 1;
                _context.next = 4;
                return this._fetchAsync(baseUrl + "/api/v0.3/service/register/" + clientId, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  }
                });

              case 4:
                response = _context.sent;


                this.emit("code-refresh", response);
                this._currentSessionId = response.session;

                // Start watching for status
                this.stopTicket = this._waitingLoginComplete(response.session);

                return _context.abrupt("return", response);

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](1);
                throw _context.t0;

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 11]]);
      }));

      function generateSSOData() {
        return _ref2.apply(this, arguments);
      }

      return generateSSOData;
    }()

    /**
     * Deconstructor
     *
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.stopTicket) {
        this.stopTicket();
        this.stopTicket = null;
      }
    }

    /**
     * Generate appLink string
     * Example: blockpass-local://sso/3rd_service_demo/c33ab4f2-c208-4cc0-9adf-e49cccff6d2c
     */

  }, {
    key: "getApplink",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", new _promise2.default(function () {
                  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(resolve, reject) {
                    var applinkString, prefix;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            applinkString = void 0;

                          case 1:
                            if (!true) {
                              _context2.next = 10;
                              break;
                            }

                            if (!_this2._currentSessionId) {
                              _context2.next = 6;
                              break;
                            }

                            prefix = APPLINK_ENV[_this2.env];

                            applinkString = prefix + "://sso/" + _this2.clientId + "/" + _this2._currentSessionId;
                            return _context2.abrupt("break", 10);

                          case 6:
                            _context2.next = 8;
                            return _this2._sleep(_this2.refreshRateMs / 2);

                          case 8:
                            _context2.next = 1;
                            break;

                          case 10:

                            resolve(applinkString);

                          case 11:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this2);
                  }));

                  return function (_x, _x2) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getApplink() {
        return _ref3.apply(this, arguments);
      }

      return getApplink;
    }()
  }, {
    key: "_waitingLoginComplete",
    value: function _waitingLoginComplete(sessionId) {
      if (this.stopTicket) {
        this.stopTicket();
        this.stopTicket = null;
      }

      var self = this;
      var refreshRateMs = this.refreshRateMs,
          _sleep = this._sleep;


      function InternalJob() {
        var _isRunning = true;

        this.start = function () {
          var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var response, data, status;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!_isRunning) {
                      _context4.next = 22;
                      break;
                    }

                    _context4.next = 3;
                    return self._refreshSessionTicket(sessionId);

                  case 3:
                    response = _context4.sent;

                    if (_isRunning) {
                      _context4.next = 6;
                      break;
                    }

                    return _context4.abrupt("return");

                  case 6:
                    if (response) {
                      _context4.next = 10;
                      break;
                    }

                    _context4.next = 9;
                    return _sleep(refreshRateMs);

                  case 9:
                    return _context4.abrupt("continue", 0);

                  case 10:
                    data = response.data;
                    status = data.status;

                    if (!(status === "success" || status === "failed")) {
                      _context4.next = 17;
                      break;
                    }

                    self.emit("sso-complete", data);
                    return _context4.abrupt("break", 22);

                  case 17:
                    if (status === "processing") self.emit("sso-processing", data);

                  case 18:
                    _context4.next = 20;
                    return _sleep(refreshRateMs);

                  case 20:
                    _context4.next = 0;
                    break;

                  case 22:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          function start() {
            return _ref5.apply(this, arguments);
          }

          return start;
        }();

        this.stop = function stop() {
          _isRunning = false;
        };
      }

      var ins = new InternalJob();
      ins.start();

      return ins.stop;
    }
  }, {
    key: "_refreshSessionTicket",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(sessionId) {
        var baseUrl, response;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                baseUrl = this.baseUrl;
                _context5.next = 4;
                return this._fetchAsync(baseUrl + "/api/v0.3/service/registerPolling/" + sessionId, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json"
                  }
                });

              case 4:
                response = _context5.sent;
                return _context5.abrupt("return", response);

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                return _context5.abrupt("return", null);

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 8]]);
      }));

      function _refreshSessionTicket(_x3) {
        return _ref6.apply(this, arguments);
      }

      return _refreshSessionTicket;
    }()
  }, {
    key: "_fetchAsync",
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(url, configs) {
        var response;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return fetch(url, configs);

              case 2:
                response = _context6.sent;

                if (!response.ok) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt("return", response.json());

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function _fetchAsync(_x4, _x5) {
        return _ref7.apply(this, arguments);
      }

      return _fetchAsync;
    }()
  }, {
    key: "_sleep",
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var timeMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", new _promise2.default(function (resolve, reject) {
                  setTimeout(function () {
                    resolve();
                  }, timeMs);
                }));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function _sleep() {
        return _ref8.apply(this, arguments);
      }

      return _sleep;
    }()
  }]);
  return WebSDK;
}(_events2.default);

exports.default = WebSDK;

/**
 * ----------------------------------------------------------
 */

/**
 * @typedef {object} ConstructorParams
 * @property {string} baseUrl - Blockpass url.
 * @property {string} clientId - Blockpass ClientId (obtain when register with Blockpass platform). 
 
 */

/**
 * Generated session code, can only be used once. Life cycles (created -> processing -> success|failed)
 * Client must refresh code after sso failed / timeout
 * @event WebSDK#code-refresh
 * @type {object}
 * @property {string} session - sessionID
 */

/**
 * Session code switch to processing
 * @event WebSDK#sso-processing
 * @type {object}
 * @property {string} status - status of session code
 */

/**
 * Session code switch to processing
 * @event WebSDK#sso-complete
 * @type {object}
 * @property {string} status - status of session code (success|failed)
 * @property {object} extraData - extraData
 * @property {string} extraData.sessionData - session code
 * @property {object} extraData.extraData - Services' extra data
 */