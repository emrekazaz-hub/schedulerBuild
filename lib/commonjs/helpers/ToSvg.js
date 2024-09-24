"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeSvg = require("react-native-svg");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Define the props for the SvgComponent

const SvgComponent = ({
  xml,
  width,
  height
}) => {
  return /*#__PURE__*/_react.default.createElement(_reactNativeSvg.SvgXml, {
    xml: xml,
    width: width,
    height: height
  });
};

// Define the props for the ToSvg component

const ToSvg = ({
  svgXml,
  width = 50,
  height = width,
  color = null
}) => {
  let updatedSvgXml = svgXml;
  if (color) {
    updatedSvgXml = updatedSvgXml.replace(/(fill|stroke)="#\w+"/g, `$1="${color}"`);
  }
  return /*#__PURE__*/_react.default.createElement(SvgComponent, {
    xml: updatedSvgXml,
    width: width,
    height: height
  });
};
var _default = exports.default = ToSvg;
//# sourceMappingURL=ToSvg.js.map