"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _react = require("react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useDeepCompare = props => {
  const previousState = (0, _react.useRef)(props);
  const [data, updateData] = (0, _react.useState)(props);
  (0, _react.useEffect)(() => {
    if (!(0, _isEqual.default)(previousState.current, props)) {
      updateData(props);
      previousState.current = props;
    }
  }, [props]);
  return data;
};
var _default = exports.default = useDeepCompare;
//# sourceMappingURL=useDeepCompare.js.map