"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _timeZone = require("../../assets/timeZone");
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
var _useDragCreateGesture = _interopRequireDefault(require("../../hooks/useDragCreateGesture"));
var _usePinchGesture = _interopRequireDefault(require("../../hooks/usePinchGesture"));
var _useTimelineScroll = _interopRequireDefault(require("../../hooks/useTimelineScroll"));
var _utils = require("../../utils");
var _DragCreateItem = _interopRequireDefault(require("./DragCreateItem"));
var _TimelineHeader = _interopRequireDefault(require("./TimelineHeader"));
var _TimelineSlots = _interopRequireDefault(require("./TimelineSlots"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Timeline = ({
  renderDayBarItem,
  onPressDayNum,
  onDragCreateEnd,
  onLongPressBackground,
  isLoading,
  events,
  selectedEvent,
  highlightDates,
  onChange,
  onTimeIntervalHeightChange,
  ...other
}, ref) => {
  const {
    timelineLayoutRef,
    minTimeIntervalHeight,
    theme,
    totalHours,
    allowDragToCreate,
    firstDate,
    viewMode,
    totalPages,
    timelineHorizontalListRef,
    timeIntervalHeight,
    spaceFromTop,
    allowPinchToZoom,
    scrollToNow,
    initialDate,
    isShowHeader,
    currentIndex,
    pages,
    tzOffset,
    maxTimeIntervalHeight,
    updateCurrentDate,
    offsetY,
    timelineVerticalListRef,
    initialTimeIntervalHeight,
    heightByTimeInterval,
    start
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = (0, _useTimelineScroll.default)();
  (0, _react.useImperativeHandle)(ref, () => ({
    goToDate: props => {
      var _timelineHorizontalLi;
      const numOfDays = viewMode === 'workWeek' ? _constants.COLUMNS.week : _constants.COLUMNS[viewMode];
      const currentDay = _momentTimezone.default.tz(props === null || props === void 0 ? void 0 : props.date, tzOffset);
      const firstDateMoment = _momentTimezone.default.tz(firstDate.current[viewMode], tzOffset);
      const diffDays = currentDay.clone().startOf('D').diff(firstDateMoment, 'd');
      const pageIndex = Math.floor(diffDays / numOfDays);
      if (pageIndex < 0 || pageIndex > totalPages[viewMode] - 1) {
        return;
      }
      (_timelineHorizontalLi = timelineHorizontalListRef.current) === null || _timelineHorizontalLi === void 0 ? void 0 : _timelineHorizontalLi.scrollToIndex({
        index: pageIndex,
        animated: props === null || props === void 0 ? void 0 : props.animatedDate
      });
      if (props !== null && props !== void 0 && props.hourScroll) {
        const minutes = currentDay.hour() * 60 + currentDay.minute();
        const subtractMinutes = minutes - start * 60;
        const position = subtractMinutes * timeIntervalHeight.value / 60 + spaceFromTop;
        const offset = timelineLayoutRef.current.height / 2;
        goToOffsetY(Math.max(0, position - offset), props === null || props === void 0 ? void 0 : props.animatedHour);
      }
    },
    goToNextPage: goToNextPage,
    goToPrevPage: goToPrevPage,
    getZones: () => Object.values(_timeZone.timeZoneData),
    getZone: key => _timeZone.timeZoneData[key],
    getHour: () => {
      const position = Math.max(0, offsetY.value - spaceFromTop + 8);
      const minutes = position * 60 / heightByTimeInterval.value;
      const hour = minutes / 60 + start;
      return Math.max(0, hour);
    },
    getDate: () => {
      const numOfDays = viewMode === 'workWeek' ? _constants.COLUMNS.week : _constants.COLUMNS[viewMode];
      const firstDateMoment = _momentTimezone.default.tz(firstDate.current[viewMode], tzOffset);
      const pageIndex = currentIndex.value;
      const currentDay = firstDateMoment.add(pageIndex * numOfDays, 'd');
      return currentDay.toISOString();
    },
    goToHour: (hour, animated) => {
      const minutes = (hour - start) * 60;
      const position = minutes * heightByTimeInterval.value / 60 + spaceFromTop;
      goToOffsetY(Math.max(0, position - 8), animated);
    },
    forceUpdateNowIndicator: updateCurrentDate,
    zoom: props => {
      var _timelineVerticalList;
      let newHeight = (props === null || props === void 0 ? void 0 : props.height) ?? initialTimeIntervalHeight;
      if (props !== null && props !== void 0 && props.scale) {
        newHeight = timeIntervalHeight.value * props.scale;
      }
      const clampedHeight = (0, _utils.clampValues)(newHeight, minTimeIntervalHeight.value, maxTimeIntervalHeight);
      const pinchYNormalized = offsetY.value / timeIntervalHeight.value;
      const pinchYScale = clampedHeight * pinchYNormalized;
      const y = pinchYScale;
      (_timelineVerticalList = timelineVerticalListRef.current) === null || _timelineVerticalList === void 0 ? void 0 : _timelineVerticalList.scrollTo({
        x: 0,
        y,
        animated: true
      });
      timeIntervalHeight.value = (0, _reactNativeReanimated.withTiming)(clampedHeight);
    }
  }), [goToNextPage, goToPrevPage, updateCurrentDate, viewMode, tzOffset, firstDate, totalPages, timelineHorizontalListRef, start, timeIntervalHeight, spaceFromTop, timelineLayoutRef, goToOffsetY, offsetY.value, heightByTimeInterval.value, currentIndex.value, initialTimeIntervalHeight, minTimeIntervalHeight.value, maxTimeIntervalHeight, timelineVerticalListRef]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => timeIntervalHeight.value, (next, prev) => {
    if (next === prev || !onTimeIntervalHeightChange) {
      return;
    }
    (0, _reactNativeReanimated.runOnJS)(onTimeIntervalHeightChange)(next);
  }, [onTimeIntervalHeightChange]);
  (0, _react.useEffect)(() => {
    if (!timelineLayoutRef.current.height) {
      return;
    }
    requestAnimationFrame(() => {
      const current = _momentTimezone.default.tz(tzOffset);
      const isSameDate = current.format('YYYY-MM-DD') === initialDate.current;
      if (scrollToNow && isSameDate) {
        const minutes = current.hour() * 60 + current.minute();
        const subtractMinutes = minutes - start * 60;
        const position = subtractMinutes * heightByTimeInterval.value / 60 + spaceFromTop;
        const offset = timelineLayoutRef.current.height / 2;
        goToOffsetY(Math.max(0, position - offset), true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goToOffsetY, scrollToNow, timelineLayoutRef.current.height]);
  const _onContentLayout = ({
    nativeEvent: {
      layout
    }
  }) => {
    if (!minTimeIntervalHeight.value) {
      const minHeight = Math.max(layout.height / (totalHours + 1), _constants.DEFAULT_PROPS.MIN_TIME_INTERVAL_HEIGHT);
      minTimeIntervalHeight.value = minHeight;
    }
    timelineLayoutRef.current = {
      width: layout.width,
      height: layout.height
    };
  };
  const {
    zoomGesture
  } = (0, _usePinchGesture.default)({
    enabled: allowPinchToZoom && !(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id)
  });
  const {
    dragCreateGesture,
    isDraggingCreate,
    dragXPosition,
    dragYPosition,
    currentHour,
    onLongPress
  } = (0, _useDragCreateGesture.default)({
    onDragCreateEnd
  });
  const _onLongPressBackground = (date, event) => {
    if (allowDragToCreate && !selectedEvent) {
      onLongPress(event);
    }
    onLongPressBackground === null || onLongPressBackground === void 0 ? void 0 : onLongPressBackground(date, event);
  };
  const groupedEvents = (0, _react.useMemo)(() => (0, _utils.groupEventsByDate)(events, tzOffset), [events, tzOffset]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => currentIndex.value, (index, prevIndex) => {
    if (!onChange) {
      return;
    }
    const startDate = pages[viewMode].data[index];
    if (startDate) {
      (0, _reactNativeReanimated.runOnJS)(onChange)({
        length: pages[viewMode].data.length,
        index,
        prevIndex,
        date: startDate
      });
    }
  }, [viewMode]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: [styles.container, {
      backgroundColor: theme.backgroundColor
    }]
  }, isShowHeader && /*#__PURE__*/_react.default.createElement(_TimelineHeader.default, {
    renderDayBarItem: renderDayBarItem,
    onPressDayNum: onPressDayNum,
    isLoading: isLoading,
    highlightDates: highlightDates,
    selectedEventId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.content,
    onLayout: _onContentLayout
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: _reactNativeGestureHandler.Gesture.Race(dragCreateGesture, zoomGesture)
  }, /*#__PURE__*/_react.default.createElement(_TimelineSlots.default, _extends({}, other, {
    events: groupedEvents,
    selectedEvent: selectedEvent,
    isDragging: isDraggingCreate,
    isLoading: isLoading,
    onLongPressBackground: _onLongPressBackground
  }))), isDraggingCreate && /*#__PURE__*/_react.default.createElement(_DragCreateItem.default, {
    offsetX: dragXPosition,
    offsetY: dragYPosition,
    currentHour: currentHour
  })));
};
var _default = exports.default = /*#__PURE__*/(0, _react.forwardRef)(Timeline);
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexGrow: 1
  }
});
//# sourceMappingURL=index.js.map