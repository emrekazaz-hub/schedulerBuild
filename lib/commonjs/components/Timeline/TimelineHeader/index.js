"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _flashList = require("@shopify/flash-list");
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../../constants");
var _TimelineProvider = require("../../../context/TimelineProvider");
var _MultipleDayBar = _interopRequireDefault(require("./MultipleDayBar"));
var _ProgressBar = _interopRequireDefault(require("./ProgressBar"));
var _SingleDayBar = _interopRequireDefault(require("./SingleDayBar"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TimelineHeader = ({
  renderDayBarItem,
  onPressDayNum,
  isLoading,
  highlightDates,
  selectedEventId
}) => {
  const {
    syncedLists,
    viewMode,
    dayBarListRef,
    pages,
    timelineWidth,
    rightSideWidth,
    currentIndex,
    hourWidth,
    columnWidth,
    theme,
    locale,
    tzOffset,
    currentDate
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const [startDate, setStartDate] = (0, _react.useState)(pages[viewMode].data[pages[viewMode].index] || '');
  const dayBarIndex = (0, _react.useRef)(pages.week.index);
  const _renderSingleDayItem = ({
    item,
    extraData
  }) => {
    const dayItemProps = {
      width: timelineWidth,
      startDate: item,
      columnWidth,
      hourWidth,
      viewMode,
      onPressDayNum,
      theme: extraData.theme,
      locale: extraData.locale,
      highlightDates: extraData.highlightDates,
      tzOffset,
      currentDate: extraData.currentDate
    };
    if (renderDayBarItem) {
      return renderDayBarItem(dayItemProps);
    }
    return /*#__PURE__*/_react.default.createElement(_SingleDayBar.default, dayItemProps);
  };
  const _renderMultipleDayItem = ({
    item,
    extraData
  }) => {
    const dayItemProps = {
      width: rightSideWidth,
      startDate: item,
      columnWidth,
      hourWidth,
      viewMode,
      onPressDayNum,
      theme: extraData.theme,
      locale: extraData.locale,
      highlightDates: extraData.highlightDates,
      tzOffset,
      currentDate: extraData.currentDate
    };
    if (renderDayBarItem) {
      return renderDayBarItem(dayItemProps);
    }
    return /*#__PURE__*/_react.default.createElement(_MultipleDayBar.default, dayItemProps);
  };
  const extraValues = (0, _react.useMemo)(() => ({
    locale,
    highlightDates,
    theme,
    currentDate
  }), [locale, highlightDates, theme, currentDate]);
  const _renderDayBarList = () => {
    const listProps = {
      ref: dayBarListRef,
      keyExtractor: item => item,
      scrollEnabled: false,
      disableHorizontalListHeightMeasurement: true,
      showsHorizontalScrollIndicator: false,
      horizontal: true,
      bounces: false,
      scrollEventThrottle: 16,
      pagingEnabled: true,
      extraData: extraValues
    };
    if (viewMode === 'day') {
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: {
          width: timelineWidth
        }
      }, /*#__PURE__*/_react.default.createElement(_flashList.AnimatedFlashList, _extends({}, listProps, {
        data: pages[viewMode].data,
        initialScrollIndex: pages[viewMode].index,
        estimatedItemSize: timelineWidth,
        estimatedListSize: {
          width: timelineWidth,
          height: _constants.DEFAULT_PROPS.DAY_BAR_HEIGHT
        },
        renderItem: _renderSingleDayItem,
        onScroll: e => {
          const x = e.nativeEvent.contentOffset.x;
          const width = e.nativeEvent.layoutMeasurement.width;
          const pageIndex = Math.round(x / width);
          if (dayBarIndex.current !== pageIndex) {
            dayBarIndex.current = pageIndex;
          }
        }
      })));
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.multipleDayContainer
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        width: hourWidth
      }
    }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        width: rightSideWidth
      }
    }, /*#__PURE__*/_react.default.createElement(_flashList.AnimatedFlashList, _extends({}, listProps, {
      data: pages[viewMode].data,
      initialScrollIndex: pages[viewMode].index,
      estimatedItemSize: rightSideWidth,
      estimatedListSize: {
        width: rightSideWidth,
        height: _constants.DEFAULT_PROPS.DAY_BAR_HEIGHT
      },
      renderItem: _renderMultipleDayItem
    }))));
  };
  (0, _reactNativeReanimated.useAnimatedReaction)(() => currentIndex.value, index => {
    if (syncedLists) {
      return;
    }
    const dateByIndex = pages[viewMode].data[index];
    if (dateByIndex) {
      (0, _reactNativeReanimated.runOnJS)(setStartDate)(dateByIndex);
    }
  }, [viewMode, syncedLists]);
  const _renderDayBarView = () => {
    if (viewMode === 'day') {
      return _renderSingleDayItem({
        item: startDate,
        extraData: extraValues,
        index: 0,
        target: 'Cell'
      });
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.multipleDayContainer
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        width: hourWidth
      }
    }), _renderMultipleDayItem({
      item: startDate,
      extraData: extraValues,
      index: 0,
      target: 'Cell'
    }));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      backgroundColor: theme.backgroundColor
    }]
  }, syncedLists ? _renderDayBarList() : _renderDayBarView(), selectedEventId && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.disabledFrame
  }), isLoading && /*#__PURE__*/_react.default.createElement(_ProgressBar.default, {
    barColor: theme.loadingBarColor
  }));
};
var _default = exports.default = TimelineHeader;
const styles = _reactNative.StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 99
  },
  multipleDayContainer: {
    flexDirection: 'row'
  },
  disabledFrame: {
    ..._reactNative.StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0)'
  }
});
//# sourceMappingURL=index.js.map