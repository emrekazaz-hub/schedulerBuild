"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
var _useTimelineScroll = _interopRequireDefault(require("../../hooks/useTimelineScroll"));
var _utils = require("../../utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EVENT_DEFAULT_COLOR = '#FFFFFF';
const DragEditItem = ({
  selectedEvent,
  onEndDragSelectedEvent,
  renderEventContent,
  isEnabled = true,
  EditIndicatorComponent
}) => {
  const {
    columnWidth,
    hourWidth,
    offsetY,
    dragStep,
    pages,
    currentIndex,
    isScrolling,
    timelineWidth,
    rightEdgeSpacing,
    spaceFromTop,
    timeIntervalHeight,
    heightByTimeInterval,
    viewMode,
    spaceFromBottom,
    timelineLayoutRef,
    totalHours,
    theme,
    hourFormat,
    useHaptic,
    tzOffset,
    start,
    navigateDelay
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = (0, _useTimelineScroll.default)();
  const event = (0, _react.useRef)(selectedEvent).current;
  const leftWithHourColumn = event.leftByIndex + hourWidth;
  const defaultTopPosition = event.top + spaceFromTop;
  const eventWidth = (0, _reactNativeReanimated.useSharedValue)(event.width);
  const eventLeft = (0, _reactNativeReanimated.useSharedValue)(leftWithHourColumn + event.left);
  const currentHour = (0, _reactNativeReanimated.useSharedValue)(event.top / heightByTimeInterval.value + start);
  const startOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const startXY = (0, _reactNativeReanimated.useSharedValue)({
    x: 0,
    y: 0
  });
  const translateX = (0, _reactNativeReanimated.useSharedValue)(0);
  const eventTop = (0, _reactNativeReanimated.useSharedValue)(defaultTopPosition);
  const eventHeight = (0, _reactNativeReanimated.useSharedValue)(event.height);
  (0, _react.useEffect)(() => {
    if (useHaptic) {
      (0, _utils.triggerHaptic)();
    }
  }, [useHaptic]);
  (0, _react.useEffect)(() => {
    requestAnimationFrame(() => {
      eventWidth.value = (0, _reactNativeReanimated.withTiming)(columnWidth - rightEdgeSpacing, {
        duration: 100
      });
      eventLeft.value = (0, _reactNativeReanimated.withTiming)(leftWithHourColumn, {
        duration: 100
      });
    });
  }, [columnWidth, eventLeft, eventWidth, leftWithHourColumn, rightEdgeSpacing]);
  const timeoutRef = (0, _react.useRef)(null);
  const _handleScroll = ({
    x,
    y,
    type
  }) => {
    if (timeoutRef.current && x > hourWidth && x < timelineWidth - 25) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (x <= hourWidth) {
      if (isScrolling.current || timeoutRef.current) {
        return;
      }
      timeoutRef.current = setInterval(() => {
        goToPrevPage(true);
      }, navigateDelay);
    }
    if (x >= timelineWidth - 25) {
      if (isScrolling.current || timeoutRef.current) {
        return;
      }
      timeoutRef.current = setInterval(() => {
        goToNextPage(true);
      }, navigateDelay);
    }
    const scrollTargetDiff = Math.abs(startOffsetY.value - offsetY.value);
    const scrollInProgress = scrollTargetDiff > 3;
    if (scrollInProgress) {
      return;
    }
    const startY = y + timeIntervalHeight.value;
    if (startY < 3 && offsetY.value > 0 && type === 'swipe_up') {
      const targetOffset = Math.max(0, offsetY.value - timeIntervalHeight.value * 3);
      startOffsetY.value = targetOffset;
      goToOffsetY(targetOffset);
    }
    const pageSize = timelineLayoutRef.current.height;
    const scrollPosition = y + eventHeight.value - timeIntervalHeight.value;
    if (scrollPosition > pageSize - 3 && type === 'swipe_down') {
      const spacingInBottomAndTop = spaceFromTop + spaceFromBottom;
      const timelineHeight = totalHours * timeIntervalHeight.value;
      const maxOffsetY = timelineHeight + spacingInBottomAndTop - pageSize;
      const nextOffset = offsetY.value + timeIntervalHeight.value * 3;
      const targetOffset = Math.min(maxOffsetY, nextOffset);
      startOffsetY.value = targetOffset;
      goToOffsetY(targetOffset);
    }
  };
  const recalculateEvent = () => {
    const newLeftPosition = selectedEvent.leftByIndex + translateX.value;
    const dayIndex = Math.round(newLeftPosition / columnWidth);
    const startDate = pages[viewMode].data[currentIndex.value];
    const currentDateMoment = _momentTimezone.default.tz(startDate, tzOffset).add(dayIndex, 'd').add(currentHour.value, 'h');
    const newEvent = {
      ...selectedEvent,
      left: newLeftPosition,
      top: eventTop.value,
      height: eventHeight.value,
      start: currentDateMoment.toISOString(),
      end: currentDateMoment.clone().add(eventHeight.value / heightByTimeInterval.value, 'h').toISOString()
    };
    if (onEndDragSelectedEvent) {
      onEndDragSelectedEvent(newEvent);
    }
  };
  const clearCurrentInterval = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const dragPositionGesture = _reactNativeGestureHandler.Gesture.Pan().enabled(isEnabled).runOnJS(true).maxPointers(1).onStart(() => {
    startOffsetY.value = offsetY.value;
    startXY.value = {
      x: translateX.value,
      y: eventTop.value - offsetY.value
    };
  }).onUpdate(({
    translationX,
    translationY,
    absoluteX
  }) => {
    const initIndex = event.leftByIndex / columnWidth;
    const maxIndex = _constants.COLUMNS[viewMode] - 1;
    const minRounded = -initIndex;
    const maxRounded = maxIndex - initIndex;
    const nextTranslateX = startXY.value.x + translationX;
    const xToIndex = Math.round(nextTranslateX / columnWidth);
    const clampIndex = Math.min(Math.max(minRounded, xToIndex), maxRounded);
    const roundedTranslateX = clampIndex * columnWidth;
    const nextTranslateY = startXY.value.y + translationY;
    const offset = offsetY.value - spaceFromTop;
    const originalY = startXY.value.y + offset + translationY;
    const originalTime = originalY / heightByTimeInterval.value;
    const roundedHour = (0, _utils.roundTo)(originalTime, dragStep, 'up');
    const newTopPosition = roundedHour * heightByTimeInterval.value + spaceFromTop;
    const isSameX = translateX.value === roundedTranslateX;
    const isSameY = eventTop.value === newTopPosition;
    if (!isSameX || !isSameY) {
      translateX.value = (0, _reactNativeReanimated.withTiming)(roundedTranslateX, {
        duration: 100,
        easing: _reactNativeReanimated.Easing.linear
      });
      eventTop.value = newTopPosition;
      currentHour.value = roundedHour + start;
      if (useHaptic) {
        (0, _reactNativeReanimated.runOnJS)(_utils.triggerHaptic)();
      }
    }
    (0, _reactNativeReanimated.runOnJS)(_handleScroll)({
      x: absoluteX,
      y: nextTranslateY,
      type: nextTranslateY > startXY.value.y ? 'swipe_down' : 'swipe_up'
    });
  }).onEnd(() => {
    (0, _reactNativeReanimated.runOnJS)(recalculateEvent)();
  }).onTouchesUp(() => {
    (0, _reactNativeReanimated.runOnJS)(clearCurrentInterval)();
  });
  const startHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const dragDurationGesture = _reactNativeGestureHandler.Gesture.Pan().enabled(isEnabled).runOnJS(true).maxPointers(1).onStart(() => {
    startOffsetY.value = offsetY.value;
    startHeight.value = eventHeight.value;
  }).onUpdate(e => {
    const heightOfTenMinutes = dragStep / 60 * heightByTimeInterval.value;
    const nextHeight = startHeight.value + e.translationY;
    const roundedHeight = Math.ceil(nextHeight / heightOfTenMinutes) * heightOfTenMinutes;
    const clampedHeight = Math.max(roundedHeight, heightOfTenMinutes);
    const isSameHeight = eventHeight.value === clampedHeight;
    if (!isSameHeight) {
      eventHeight.value = clampedHeight;
      if (useHaptic) {
        (0, _reactNativeReanimated.runOnJS)(_utils.triggerHaptic)();
      }
    }
  }).onEnd(() => {
    (0, _reactNativeReanimated.runOnJS)(recalculateEvent)();
  }).onTouchesUp(() => {
    (0, _reactNativeReanimated.runOnJS)(clearCurrentInterval)();
  });
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      height: eventHeight.value,
      width: eventWidth.value,
      left: eventLeft.value,
      top: eventTop.value,
      transform: [{
        translateX: translateX.value
      }]
    };
  }, []);
  const _renderEventContent = () => {
    var _event$description, _event$description2, _event$description3, _event$description4, _event$description5;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.titleEvent, {
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: dragPositionGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.eventContainer, {
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR,
      top: defaultTopPosition
    }, event.containerStyle, animatedStyle]
  }, renderEventContent ? renderEventContent(event, heightByTimeInterval) : _renderEventContent(), /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: dragDurationGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.indicatorContainer
  }, EditIndicatorComponent ? EditIndicatorComponent : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.indicator
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.indicatorLine, theme.editIndicatorColor ? {
      backgroundColor: theme.editIndicatorColor
    } : undefined]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.indicatorLine, theme.editIndicatorColor ? {
      backgroundColor: theme.editIndicatorColor
    } : undefined]
  })))))), /*#__PURE__*/_react.default.createElement(AnimatedHour, {
    currentHour: currentHour,
    animatedTop: eventTop,
    top: defaultTopPosition,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }), /*#__PURE__*/_react.default.createElement(AnimatedEndHour, {
    currentHour: currentHour,
    eventTop: eventTop,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat,
    heightByTimeInterval: heightByTimeInterval,
    eventHeight: eventHeight
  }));
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(DragEditItem);
const AnimatedHour = ({
  currentHour,
  animatedTop,
  top,
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
      top: animatedTop.value - 6
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8,
      top: top - 6
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, time));
};
const AnimatedEndHour = ({
  currentHour,
  eventTop,
  hourWidth,
  theme,
  hourFormat,
  eventHeight,
  heightByTimeInterval
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
    const endHour = startHour + eventHeight.value / heightByTimeInterval.value;
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
    const endHourTop = eventTop.value + eventHeight.value - 6;
    return {
      top: endHourTop
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.hourText, theme.dragHourText]
  }, endTime));
};
const styles = _reactNative.StyleSheet.create({
  eventContainer: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden'
  },
  badgeContainer: {
    padding: 2,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginBottom: 2
  },
  hourContainer: {
    position: 'absolute',
    borderColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  indicator: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 24
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 10,
    color: _constants.DEFAULT_PROPS.BLACK_COLOR
  },
  hourText: {
    color: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  },
  indicatorLine: {
    width: 12,
    height: 2,
    backgroundColor: '#000',
    marginBottom: 2
  },
  titleEvent: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 14,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 12
  }
});
//# sourceMappingURL=DragEditItem.js.map