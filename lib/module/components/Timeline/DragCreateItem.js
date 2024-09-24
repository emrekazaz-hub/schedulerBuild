import moment from 'moment-timezone';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle } from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
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
  } = useTimelineCalendarContext();
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: dragCreateInterval / 60 * heightByTimeInterval.value,
      transform: [{
        translateX: offsetX.value
      }, {
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.defaultStyle, {
      left: hourWidth,
      backgroundColor: theme.dragCreateItemBackgroundColor,
      width: columnWidth
    }, animatedStyles]
  }), /*#__PURE__*/React.createElement(AnimatedHour, {
    currentHour: currentHour,
    offsetY: offsetY,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }), /*#__PURE__*/React.createElement(AnimatedEndHour, {
    currentHour: currentHour,
    offsetY: offsetY,
    heightByTimeInterval: heightByTimeInterval,
    dragCreateInterval: dragCreateInterval,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }));
};
export default DragCreateItem;
const AnimatedHour = ({
  currentHour,
  offsetY,
  hourWidth,
  theme,
  hourFormat
}) => {
  const [time, setTime] = useState('');
  const _onChangedTime = (hourStr, minutesStr) => {
    let newTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newTime = moment(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setTime(newTime);
  };
  useAnimatedReaction(() => currentHour.value, hour => {
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
    runOnJS(_onChangedTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/React.createElement(Text, {
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
  const [endTime, setEndTime] = useState('');
  const _onChangedEndTime = (hourStr, minutesStr) => {
    let newEndTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newEndTime = moment(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setEndTime(newEndTime);
  };
  useAnimatedReaction(() => {
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
    runOnJS(_onChangedEndTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: offsetY.value + dragCreateInterval / 60 * heightByTimeInterval.value
      }]
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/React.createElement(Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, endTime));
};
const styles = StyleSheet.create({
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
    borderColor: DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR
  },
  hourText: {
    color: DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  }
});
//# sourceMappingURL=DragCreateItem.js.map