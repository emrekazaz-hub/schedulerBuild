"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _constants = require("../../../constants");
var _utils = require("../../../utils");
var _TimelineProvider = require("../../../context/TimelineProvider");
var _SvgPaths = require("../../../helpers/SvgPaths");
var _ToSvg = _interopRequireDefault(require("../../../helpers/ToSvg"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const SingleDayBar = ({
  width,
  startDate,
  theme,
  locale,
  highlightDates,
  onPressDayNum,
  currentDate,
  tzOffset
}) => {
  const _renderDay = () => {
    var _minuteStyle, _minuteStyle2, _minuteStyle3;
    const {
      dayMinutes,
      dayMinuteStyle
    } = (0, _TimelineProvider.useTimelineCalendarContext)();
    const dateByIndex = _momentTimezone.default.tz(startDate, tzOffset);
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const event = dayMinutes === null || dayMinutes === void 0 ? void 0 : dayMinutes.find(eventDate => eventDate.date === dateStr);
    const fahrstunde = event ? `${event.FS} min.` : '0 min.';
    const theoriestunde = event ? `${event.TU} min.` : '0 min.';
    const sonstige = event ? `${event.SO} min.` : '0 min.';
    let containerStyle;
    let minuteStyle;
    const [dayNameText, dayNum] = dateByIndex.locale(locale).format('ddd,DD.MM').split(',');
    const highlightDate = highlightDates === null || highlightDates === void 0 ? void 0 : highlightDates[dateStr];
    const {
      dayName,
      dayNumber,
      dayNumberContainer,
      dayFS,
      daySO,
      dayTU
    } = (0, _utils.getDayBarStyle)(currentDate, dateByIndex, theme, highlightDate, fahrstunde, theoriestunde, sonstige);
    if (dayMinuteStyle) {
      var _dayMinuteStyle$, _dayMinuteStyle$2;
      containerStyle = (_dayMinuteStyle$ = dayMinuteStyle[0]) === null || _dayMinuteStyle$ === void 0 ? void 0 : _dayMinuteStyle$.containerColor;
      minuteStyle = (_dayMinuteStyle$2 = dayMinuteStyle[0]) === null || _dayMinuteStyle$2 === void 0 ? void 0 : _dayMinuteStyle$2.minuteStyle;
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.dayItem
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayName, dayName]
    }, dayNameText), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      activeOpacity: 0.6,
      disabled: !onPressDayNum,
      onPress: () => onPressDayNum === null || onPressDayNum === void 0 ? void 0 : onPressDayNum(dateStr),
      style: [styles.dayNumBtn, dayNumberContainer]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayNumber, dayNumber]
    }, dayNum)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.containerMinutes, containerStyle]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.headerMinutesIconContainer
    }, /*#__PURE__*/_react.default.createElement(_ToSvg.default, {
      svgXml: _SvgPaths.FSicon,
      height: 13,
      width: 13,
      color: (_minuteStyle = minuteStyle) === null || _minuteStyle === void 0 ? void 0 : _minuteStyle.color
    }), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: minuteStyle
    }, dayFS)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.headerMinutesIconContainer
    }, /*#__PURE__*/_react.default.createElement(_ToSvg.default, {
      svgXml: _SvgPaths.TUicon,
      height: 13,
      width: 13,
      color: (_minuteStyle2 = minuteStyle) === null || _minuteStyle2 === void 0 ? void 0 : _minuteStyle2.color
    }), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: minuteStyle
    }, dayTU)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.headerMinutesIconContainer
    }, /*#__PURE__*/_react.default.createElement(_ToSvg.default, {
      svgXml: _SvgPaths.SOicon,
      height: 13,
      width: 13,
      color: (_minuteStyle3 = minuteStyle) === null || _minuteStyle3 === void 0 ? void 0 : _minuteStyle3.color
    }), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: minuteStyle
    }, daySO))));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      width,
      height: _constants.DEFAULT_PROPS.DAY_BAR_HEIGHT
    }]
  }, _renderDay());
};
var _default = exports.default = SingleDayBar;
const styles = _reactNative.StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  dayItem: {
    alignItems: 'center',
    flex: 1
  },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginTop: 2,
    width: 28,
    height: 28,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR
  },
  dayName: {
    color: _constants.DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 12
  },
  dayNumber: {
    color: _constants.DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 16
  },
  dayMinutesContainer: {
    backgroundColor: '#bfbfbf'
  },
  containerMinutes: {
    alignItems: 'center',
    width: '100%'
  },
  headerMinutesIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  }
});
//# sourceMappingURL=SingleDayBar.js.map