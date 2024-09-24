"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
var _SvgPaths = require("../../helpers/SvgPaths");
var _ToSvg = _interopRequireDefault(require("../../helpers/ToSvg"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const TimelineHours = () => {
  const {
    hours,
    hourWidth,
    timeIntervalHeight,
    spaceFromTop,
    theme,
    nightHours
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const _renderHour = (hour, index) => {
    return /*#__PURE__*/_react.default.createElement(HourItem, {
      key: index,
      hour: hour,
      index: index,
      timeIntervalHeight: timeIntervalHeight,
      spaceContent: spaceFromTop,
      theme: theme,
      nightIconHours: nightHours
    });
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.hours, {
      width: hourWidth,
      backgroundColor: theme.backgroundColor,
      marginBottom: spaceFromTop
    }]
  }, hours.map(_renderHour), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.verticalLine, {
      top: spaceFromTop,
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(TimelineHours);
const HourItem = ({
  hour,
  index,
  timeIntervalHeight,
  spaceContent,
  theme,
  nightIconHours
}) => {
  const hourLabelStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: timeIntervalHeight.value * index - 6 + spaceContent
    };
  });
  const isNightHour = nightIconHours === null || nightIconHours === void 0 ? void 0 : nightIconHours.includes(hour.text);
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, hourLabelStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.Text, {
    allowFontScaling: theme.allowFontScaling,
    key: `hourLabel_${hour.text}`,
    style: [styles.hourText, theme.hourText]
  }, hour.text), isNightHour && /*#__PURE__*/_react.default.createElement(_ToSvg.default, {
    svgXml: _SvgPaths.moonIcon,
    height: 10,
    width: 10
  }));
};
const styles = _reactNative.StyleSheet.create({
  hours: {
    alignItems: 'center',
    overflow: 'hidden'
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute'
  },
  hourText: {
    fontSize: 10,
    color: _constants.DEFAULT_PROPS.BLACK_COLOR
  },
  verticalLine: {
    width: 1,
    backgroundColor: _constants.DEFAULT_PROPS.CELL_BORDER_COLOR,
    position: 'absolute',
    right: 0,
    height: '100%'
  }
});
//# sourceMappingURL=TimelineHours.js.map