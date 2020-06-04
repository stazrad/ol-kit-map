"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadDataLayer = exports.createDataLayer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _vector = _interopRequireDefault(require("ol/layer/vector"));

var _vector2 = _interopRequireDefault(require("ol/source/vector"));

var _style = _interopRequireDefault(require("ol/style/style"));

var _fill = _interopRequireDefault(require("ol/style/fill"));

var _stroke = _interopRequireDefault(require("ol/style/stroke"));

var _map = _interopRequireDefault(require("ol/map"));

var _proj = _interopRequireDefault(require("ol/proj"));

var _geojson = _interopRequireDefault(require("ol/format/geojson"));

var _kml = _interopRequireDefault(require("ol/format/kml"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var getFeaturesFromDataSet = function getFeaturesFromDataSet(dataSet) {
  try {
    var geoJson = new _geojson["default"]({
      featureProjection: 'EPSG:3857'
    }); // TODO check map projection

    var features = geoJson.readFeatures(dataSet);
    return features;
  } catch (e) {
    /* must not be JSON */
  }

  try {
    var kml = new _kml["default"]();

    var _features = kml.readFeatures(dataSet);

    return _features;
  } catch (e) {}
  /* must not be KML */
  // not a supported data format, return empty features array


  return [];
};

var getLocalDataSet = function getLocalDataSet(arg) {
  var dataSet = null;

  try {
    dataSet = require("../../data/".concat(arg, ".json"));
  } catch (e) {
    /* must not be JSON */
  }

  try {
    dataSet = require("../../data/".concat(arg, ".kml"));
  } catch (e) {
    /* must not be KML */
  }

  return dataSet;
};

var isValidUrl = function isValidUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }

  return true;
};

var createDataLayer = function createDataLayer(arg, styleArg) {
  var style = _objectSpread({
    fill: {
      color: '#7FDBFF33'
    },
    stroke: {
      color: '#0074D9',
      width: 2
    }
  }, styleArg);

  var dataSet = getLocalDataSet(arg);
  var features = getFeaturesFromDataSet(dataSet);
  var layer = new _vector["default"]({
    source: new _vector2["default"]()
  });
  var source = layer.getSource();
  features.forEach(function (feature, i) {
    var properties = feature.properties;
    source.addFeature(feature);
  }); // layer.setStyle(
  //   new olStyle({
  //     fill: new olFill(style.fill),
  //     stroke: new olStroke(style.stroke)
  //   })
  // )

  return layer;
};
/**
 * Async fetch for data layers - supports geojson, kml
 * @function
 * @category DataLayers
 * @since 0.3.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {String} query - key to pull from predefined data set, url pointing to geojson or kml file, or geojson/kml file itself
 * @param {Object} [opts] - Object of optional params
 * @param {Boolean} [opts.addToMap] - opt out of adding the layer to the map (default true)
 * @param {String} [opts.style] - style object used to apply styles to the layer
 * @returns {ol.Layer} Promise that resolves with the newly created data layer
 */


exports.createDataLayer = createDataLayer;

var loadDataLayer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(map, query) {
    var optsArg,
        opts,
        features,
        localDataSet,
        featuresFromQuery,
        request,
        dataSet,
        layer,
        source,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optsArg = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};

            if (map instanceof _map["default"]) {
              _context.next = 3;
              break;
            }
          case 3:
            opts = _objectSpread({
              addToMap: true
            }, optsArg);
            features = [];
            localDataSet = getLocalDataSet(query); // check query against ./data dir to get data file

            featuresFromQuery = getFeaturesFromDataSet(query); // returns empty array if query is unsupported data type

            if (!localDataSet) {
              _context.next = 11;
              break;
            }

            // query is a string to request local data set
            features = getFeaturesFromDataSet(localDataSet);
            _context.next = 26;
            break;

          case 11:
            if (!featuresFromQuery.length) {
              _context.next = 15;
              break;
            }

            // query passed is valid data file
            features = featuresFromQuery;
            _context.next = 26;
            break;

          case 15:
            if (!isValidUrl(query)) {
              _context.next = 25;
              break;
            }

            _context.next = 18;
            return fetch(query);

          case 18:
            request = _context.sent;
            _context.next = 21;
            return request.json();

          case 21:
            dataSet = _context.sent;
            features = getFeaturesFromDataSet(dataSet);
            _context.next = 26;
            break;

          case 25:

          case 26:
            // create the layer and add features
            layer = new _vector["default"]({
              source: new _vector2["default"]()
            });
            source = layer.getSource(); // set attribute for LayerPanel title

            layer.set('title', 'Data Layer');
            features.forEach(function (feature, i) {
              var properties = feature.properties;
              source.addFeature(feature);
            }); // layer.setStyle(
            //   new olStyle({
            //     fill: new olFill(style.fill),
            //     stroke: new olStroke(style.stroke)
            //   })
            // )

            if (opts.addToMap) map.addLayer(layer);
            return _context.abrupt("return", layer);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function loadDataLayer(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.loadDataLayer = loadDataLayer;
