"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _utils = require("../../utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EVENT_DEFAULT_COLOR = '#FFFFFF';
const EventBlock = ({
  event,
  dayIndex,
  columnWidth,
  onPressEvent,
  onLongPressEvent,
  renderEventContent,
  theme,
  selectedEventId,
  eventAnimatedDuration,
  isPinchActive,
  timeIntervalHeight,
  heightByTimeInterval
}) => {
  const _onLongPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex
    };
    onLongPressEvent === null || onLongPressEvent === void 0 ? void 0 : onLongPressEvent(eventParams);
  };
  const _onPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex
    };
    onPressEvent === null || onPressEvent === void 0 ? void 0 : onPressEvent(eventParams);
  };
  const eventStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    let eventHeight = event.duration * heightByTimeInterval.value;
    if (theme.minimumEventHeight) {
      eventHeight = Math.max(theme.minimumEventHeight, eventHeight);
    }
    if (isPinchActive.value) {
      return {
        top: event.startHour * heightByTimeInterval.value,
        height: eventHeight,
        left: event.left + columnWidth * dayIndex,
        width: event.width
      };
    }
    return {
      top: (0, _reactNativeReanimated.withTiming)(event.startHour * heightByTimeInterval.value, {
        duration: eventAnimatedDuration
      }),
      height: (0, _reactNativeReanimated.withTiming)(eventHeight, {
        duration: eventAnimatedDuration
      }),
      left: (0, _reactNativeReanimated.withTiming)(event.left + columnWidth * dayIndex, {
        duration: eventAnimatedDuration
      }),
      width: (0, _reactNativeReanimated.withTiming)(event.width, {
        duration: eventAnimatedDuration
      })
    };
  }, [event]);
  const _renderEventContent = () => {
    var _event$description, _event$description2, _event$description3, _event$description4, _event$description5;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.title, {
        color: (_event$description = event.description) === null || _event$description === void 0 ? void 0 : _event$description.titleColor
      }]
    }, event.title), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.description, {
        color: (_event$description2 = event.description) === null || _event$description2 === void 0 ? void 0 : _event$description2.titleColor
      }]
    }, event === null || event === void 0 ? void 0 : (_event$description3 = event.description) === null || _event$description3 === void 0 ? void 0 : _event$description3.hour), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.description, {
        color: (_event$description4 = event.description) === null || _event$description4 === void 0 ? void 0 : _event$description4.titleColor
      }]
    }, event === null || event === void 0 ? void 0 : (_event$description5 = event.description) === null || _event$description5 === void 0 ? void 0 : _event$description5.fullName));
  };
  const eventOpacity = selectedEventId ? 0.5 : 1;
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.eventBlock, {
      opacity: eventOpacity
    }, event.containerStyle, eventStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    disabled: !!selectedEventId,
    delayLongPress: 300,
    onPress: _onPress,
    onLongPress: _onLongPress,
    style: [_reactNative.StyleSheet.absoluteFill, {
      backgroundColor: event.color || EVENT_DEFAULT_COLOR
    }],
    activeOpacity: 0.6
  }, renderEventContent ? renderEventContent(event, timeIntervalHeight) : _renderEventContent()));
};
const areEqual = (prev, next) => {
  const {
    event: prevEvent,
    theme: prevTheme,
    ...prevOther
  } = prev;
  const {
    event: nextEvent,
    theme: nextTheme,
    ...nextOther
  } = next;
  const isSameEvent = (0, _isEqual.default)(prevEvent, nextEvent);
  const isSameTheme = (0, _isEqual.default)(prevTheme, nextTheme);
  const isSameOther = (0, _utils.shallowEqual)(prevOther, nextOther);
  return isSameEvent && isSameTheme && isSameOther;
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(EventBlock, areEqual);
const styles = _reactNative.StyleSheet.create({
  eventBlock: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden'
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 14,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 12
  }
});
//# sourceMappingURL=EventBlock.js.map