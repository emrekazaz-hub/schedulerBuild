"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _TimelineProvider = require("../../../context/TimelineProvider");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const VerticalLine = ({
  index
}) => {
  const {
    columnWidth,
    theme
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.verticalLine, {
      backgroundColor: theme.cellBorderColor,
      right: columnWidth * index
    }]
  });
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(VerticalLine);
const styles = _reactNative.StyleSheet.create({
  verticalLine: {
    width: 1,
    backgroundColor: '#E8E9ED',
    position: 'absolute',
    height: '100%'
  }
});
//# sourceMappingURL=VerticalLine.js.map