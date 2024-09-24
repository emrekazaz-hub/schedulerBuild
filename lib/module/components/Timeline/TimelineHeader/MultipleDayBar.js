import times from 'lodash/times';
import moment from 'moment-timezone';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLUMNS, DEFAULT_PROPS } from '../../../constants';
import { getDayBarStyle } from '../../../utils';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
import ToSvg from '../../../helpers/ToSvg';
import { FSicon, SOicon, TUicon } from '../../../helpers/SvgPaths';
const MultipleDayBar = ({
  width,
  columnWidth,
  viewMode,
  startDate,
  onPressDayNum,
  theme,
  locale,
  highlightDates,
  currentDate,
  tzOffset
}) => {
  const {
    dayMinutes,
    dayMinuteStyle
  } = useTimelineCalendarContext();
  const _renderDay = dayIndex => {
    var _minuteStyle, _minuteStyle2, _minuteStyle3;
    const dateByIndex = moment.tz(startDate, tzOffset).add(dayIndex, 'd');
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const event = dayMinutes === null || dayMinutes === void 0 ? void 0 : dayMinutes.find(eventDate => eventDate.date === dateStr);
    const fahrstunde = event ? `${event.FS} min.` : '0 min.';
    const theoriestunde = event ? `${event.TU} min.` : '0 min.';
    const sonstige = event ? `${event.SO} min.` : '0 min.';
    dayMinutes === null || dayMinutes === void 0 ? void 0 : dayMinutes.find(eventDate => eventDate.date === dateStr);
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
    } = getDayBarStyle(currentDate, dateByIndex, theme, highlightDate, fahrstunde, theoriestunde, sonstige);
    if (dayMinuteStyle) {
      var _dayMinuteStyle$, _dayMinuteStyle$2;
      containerStyle = (_dayMinuteStyle$ = dayMinuteStyle[0]) === null || _dayMinuteStyle$ === void 0 ? void 0 : _dayMinuteStyle$.containerColor;
      minuteStyle = (_dayMinuteStyle$2 = dayMinuteStyle[0]) === null || _dayMinuteStyle$2 === void 0 ? void 0 : _dayMinuteStyle$2.minuteStyle;
    }
    return /*#__PURE__*/React.createElement(View, {
      key: `${startDate}_${dayIndex}`,
      style: [styles.dayItem, {
        width: columnWidth
      }]
    }, /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayName, dayName]
    }, dayNameText), /*#__PURE__*/React.createElement(TouchableOpacity, {
      activeOpacity: 0.6,
      disabled: !onPressDayNum,
      onPress: () => onPressDayNum === null || onPressDayNum === void 0 ? void 0 : onPressDayNum(dateStr),
      style: [styles.dayNumBtn, dayNumberContainer]
    }, /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayNumber, dayNumber]
    }, dayNum)), /*#__PURE__*/React.createElement(View, {
      style: [styles.containerMinutes, containerStyle]
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.headerMinutesIconContainer
    }, /*#__PURE__*/React.createElement(ToSvg, {
      svgXml: FSicon,
      height: 13,
      width: 13,
      color: (_minuteStyle = minuteStyle) === null || _minuteStyle === void 0 ? void 0 : _minuteStyle.color
    }), /*#__PURE__*/React.createElement(Text, {
      style: minuteStyle
    }, dayFS)), /*#__PURE__*/React.createElement(View, {
      style: styles.headerMinutesIconContainer
    }, /*#__PURE__*/React.createElement(ToSvg, {
      svgXml: TUicon,
      height: 13,
      width: 13,
      color: (_minuteStyle2 = minuteStyle) === null || _minuteStyle2 === void 0 ? void 0 : _minuteStyle2.color
    }), /*#__PURE__*/React.createElement(Text, {
      style: minuteStyle
    }, dayTU)), /*#__PURE__*/React.createElement(View, {
      style: styles.headerMinutesIconContainer
    }, /*#__PURE__*/React.createElement(ToSvg, {
      svgXml: SOicon,
      height: 13,
      width: 13,
      color: (_minuteStyle3 = minuteStyle) === null || _minuteStyle3 === void 0 ? void 0 : _minuteStyle3.color
    }), /*#__PURE__*/React.createElement(Text, {
      style: minuteStyle
    }, daySO))));
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      width,
      height: DEFAULT_PROPS.DAY_BAR_HEIGHT
    }]
  }, times(COLUMNS[viewMode]).map(_renderDay));
};
export default MultipleDayBar;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dayItem: {
    alignItems: 'center'
  },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderRadius: 14,
    width: 28,
    height: 28,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR
  },
  dayName: {
    color: DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 12
  },
  dayNumber: {
    color: DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 16
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
//# sourceMappingURL=MultipleDayBar.js.map