import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import { moonIcon } from '../../helpers/SvgPaths';
import ToSvg from '../../helpers/ToSvg';
const TimelineHours = () => {
  const {
    hours,
    hourWidth,
    timeIntervalHeight,
    spaceFromTop,
    theme,
    nightHours
  } = useTimelineCalendarContext();
  const _renderHour = (hour, index) => {
    return /*#__PURE__*/React.createElement(HourItem, {
      key: index,
      hour: hour,
      index: index,
      timeIntervalHeight: timeIntervalHeight,
      spaceContent: spaceFromTop,
      theme: theme,
      nightIconHours: nightHours
    });
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.hours, {
      width: hourWidth,
      backgroundColor: theme.backgroundColor,
      marginBottom: spaceFromTop
    }]
  }, hours.map(_renderHour), /*#__PURE__*/React.createElement(View, {
    style: [styles.verticalLine, {
      top: spaceFromTop,
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
export default /*#__PURE__*/memo(TimelineHours);
const HourItem = ({
  hour,
  index,
  timeIntervalHeight,
  spaceContent,
  theme,
  nightIconHours
}) => {
  const hourLabelStyle = useAnimatedStyle(() => {
    return {
      top: timeIntervalHeight.value * index - 6 + spaceContent
    };
  });
  const isNightHour = nightIconHours === null || nightIconHours === void 0 ? void 0 : nightIconHours.includes(hour.text);
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.hourContainer, hourLabelStyle]
  }, /*#__PURE__*/React.createElement(Animated.Text, {
    allowFontScaling: theme.allowFontScaling,
    key: `hourLabel_${hour.text}`,
    style: [styles.hourText, theme.hourText]
  }, hour.text), isNightHour && /*#__PURE__*/React.createElement(ToSvg, {
    svgXml: moonIcon,
    height: 10,
    width: 10
  }));
};
const styles = StyleSheet.create({
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
    color: DEFAULT_PROPS.BLACK_COLOR
  },
  verticalLine: {
    width: 1,
    backgroundColor: DEFAULT_PROPS.CELL_BORDER_COLOR,
    position: 'absolute',
    right: 0,
    height: '100%'
  }
});
//# sourceMappingURL=TimelineHours.js.map