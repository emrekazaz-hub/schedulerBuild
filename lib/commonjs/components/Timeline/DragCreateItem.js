"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DragCreateItem = ({
  offsetX,
  offsetY,
  currentHour
}) => {
  const {
    columnWidth,
    hourWidth,
    heightByTimeInterval,
    dragCreateInterval,
    theme,
    hourFormat
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const animatedStyles = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      height: dragCreateInterval / 60 * heightByTimeInterval.value,
      transform: [{
        translateX: offsetX.value
      }, {
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.defaultStyle, {
      left: hourWidth,
      backgroundColor: theme.dragCreateItemBackgroundColor,
      width: columnWidth
    }, animatedStyles]
  }), /*#__PURE__*/_react.default.createElement(AnimatedHour, {
    currentHour: currentHour,
    offsetY: offsetY,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }), /*#__PURE__*/_react.default.createElement(AnimatedEndHour, {
    currentHour: currentHour,
    offsetY: offsetY,
    heightByTimeInterval: heightByTimeInterval,
    dragCreateInterval: dragCreateInterval,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }));
};
var _default = exports.default = DragCreateItem;
const AnimatedHour = ({
  currentHour,
  offsetY,
  hourWidth,
  theme,
  hourFormat
}) => {
  const [time, setTime] = (0, _react.useState)('');
  const _onChangedTime = (hourStr, minutesStr) => {
    let newTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newTime = (0, _momentTimezone.default)(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setTime(newTime);
  };
  (0, _reactNativeReanimated.useAnimatedReaction)(() => currentHour.value, hour => {
    let extra = 0;
    if (hour < 0) {
      extra = 24;
    } else if (hour >= 24) {
      extra = -24;
    }
    const convertedTime = hour + extra;
    const rHours = Math.floor(convertedTime);
    const minutes = (convertedTime - rHours) * 60;
    const rMinutes = Math.round(minutes);
    const offset = rHours < 0 ? 24 : 0;
    const hourStr = rHours + offset < 10 ? '0' + rHours : rHours + offset;
    const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
    (0, _reactNativeReanimated.runOnJS)(_onChangedTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [{
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, time));
};
const AnimatedEndHour = ({
  currentHour,
  offsetY,
  heightByTimeInterval,
  dragCreateInterval,
  hourWidth,
  theme,
  hourFormat
}) => {
  const [endTime, setEndTime] = (0, _react.useState)('');
  const _onChangedEndTime = (hourStr, minutesStr) => {
    let newEndTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newEndTime = (0, _momentTimezone.default)(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setEndTime(newEndTime);
  };
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    const startHour = currentHour.value;
    const endHour = startHour + 1;
    const rHours = Math.floor(endHour);
    const minutes = (endHour - rHours) * 60;
    const rMinutes = Math.round(minutes);
    let adjustedHours = rHours;
    if (adjustedHours < 0) {
      adjustedHours += 24;
    } else if (adjustedHours >= 24) {
      adjustedHours -= 24;
    }
    const hourStr = adjustedHours < 10 ? '0' + adjustedHours : adjustedHours;
    const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
    return {
      hourStr,
      minutesStr
    };
  }, ({
    hourStr,
    minutesStr
  }) => {
    (0, _reactNativeReanimated.runOnJS)(_onChangedEndTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [{
        translateY: offsetY.value + dragCreateInterval / 60 * heightByTimeInterval.value
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, endTime));
};
const styles = _reactNative.StyleSheet.create({
  defaultStyle: {
    position: 'absolute',
    borderRadius: 4,
    top: 0,
    left: 0
  },
  hourContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4,
    borderColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR
  },
  hourText: {
    color: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  }
});
//# sourceMappingURL=DragCreateItem.js.map