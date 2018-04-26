'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSDK = function (_EventEmitter) {
    (0, _inherits3.default)(WebSDK, _EventEmitter);

    function WebSDK(configData) {
        (0, _classCallCheck3.default)(this, WebSDK);

        var _this = (0, _possibleConstructorReturn3.default)(this, (WebSDK.__proto__ || (0, _getPrototypeOf2.default)(WebSDK)).call(this));

        var _ref = configData || {},
            baseUrl = _ref.baseUrl,
            clientId = _ref.clientId,
            secretId = _ref.secretId,
            refreshRateMs = _ref.refreshRateMs;

        if (!baseUrl || !clientId || !secretId) throw new Error('Missing critical config paramaters');

        _this.baseUrl = baseUrl;
        _this.clientId = clientId;
        _this.secretId = secretId;
        _this.refreshRateMs = refreshRateMs || 5000;
        return _this;
    }

    (0, _createClass3.default)(WebSDK, [{
        key: 'generateSSOData',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var baseUrl, clientId, secretId, response;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                baseUrl = this.baseUrl, clientId = this.clientId, secretId = this.secretId;
                                _context.prev = 1;
                                _context.next = 4;
                                return this._fetchAsync(baseUrl + '/api/v0.3/service/register/' + clientId, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: (0, _stringify2.default)({
                                        client_secret: secretId
                                    })
                                });

                            case 4:
                                response = _context.sent;


                                this.emit('code-refresh', response);

                                // Start watching for status
                                this._waitingLoginComplete(response.session);

                                return _context.abrupt('return', response);

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](1);
                                throw _context.t0;

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[1, 10]]);
            }));

            function generateSSOData() {
                return _ref2.apply(this, arguments);
            }

            return generateSSOData;
        }()
    }, {
        key: '_waitingLoginComplete',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(sessionId) {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (this.timeOutTicket) {
                                    clearInterval(this.timeOutTicket);
                                    this.timeOutTicket = null;
                                }

                                this.timeOutTicket = setInterval(function () {
                                    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_) {
                                        var response, status;
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return _this2._refreshSessionTicket(sessionId);

                                                    case 2:
                                                        response = _context2.sent;

                                                        if (response) {
                                                            _context2.next = 5;
                                                            break;
                                                        }

                                                        return _context2.abrupt('return');

                                                    case 5:
                                                        status = response.status;


                                                        if (status === 'success' || status === 'failed') {
                                                            _this2.emit('sso-complete', response);
                                                            clearInterval(_this2.timeOutTicket);
                                                            _this2.timeOutTicket = null;
                                                        } else if (status === 'processing') _this2.emit('sso-processing', response);

                                                    case 7:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x2) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }(), this.refreshRateMs);

                            case 2:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _waitingLoginComplete(_x) {
                return _ref3.apply(this, arguments);
            }

            return _waitingLoginComplete;
        }()
    }, {
        key: '_refreshSessionTicket',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(sessionId) {
                var baseUrl, response;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                baseUrl = this.baseUrl;
                                _context4.next = 3;
                                return this._fetchAsync(baseUrl + '/api/v0.3/service/register/' + sessionId, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });

                            case 3:
                                response = _context4.sent;

                                console.log('refresh', sessionId, response);
                                return _context4.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function _refreshSessionTicket(_x3) {
                return _ref5.apply(this, arguments);
            }

            return _refreshSessionTicket;
        }()
    }, {
        key: '_fetchAsync',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(url, configs) {
                var response;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return fetch(url, configs);

                            case 2:
                                response = _context5.sent;

                                if (!response.ok) {
                                    _context5.next = 7;
                                    break;
                                }

                                _context5.next = 6;
                                return response.json();

                            case 6:
                                return _context5.abrupt('return', _context5.sent);

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _fetchAsync(_x4, _x5) {
                return _ref6.apply(this, arguments);
            }

            return _fetchAsync;
        }()
    }]);
    return WebSDK;
}(_events2.default);

exports.default = WebSDK;